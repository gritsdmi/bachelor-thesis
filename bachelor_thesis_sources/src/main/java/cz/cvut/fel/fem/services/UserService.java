package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Date;
import cz.cvut.fel.fem.model.*;
import cz.cvut.fel.fem.model.auth.NewPassTO;
import cz.cvut.fel.fem.model.enums.CommissionState;
import cz.cvut.fel.fem.model.enums.Role;
import cz.cvut.fel.fem.repository.UserRepository;
import cz.cvut.fel.fem.to.DateTO;
import cz.cvut.fel.fem.to.NewUserTo;
import cz.cvut.fel.fem.to.TeacherPropertyTO;
import cz.cvut.fel.fem.to.UserTO;
import cz.cvut.fel.fem.to.page.PageRequestTO;
import cz.cvut.fel.fem.to.page.PageResponseTO;
import cz.cvut.fel.fem.utils.CsvParser;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@Transactional
@Log
public class UserService {

    private final UserRepository userRepository;

    private final CsvParser csvParser;

    @Autowired
    private DateService dateService;

    @Autowired
    private ExamService examService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PositionService positionService;

    @Autowired
    public UserService(UserRepository userRepository, CsvParser csvParser) {
        this.userRepository = userRepository;
        this.csvParser = csvParser;
    }

    public User create(UserTO userTO) {
        var user = new User();
        return userRepository.save(user);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public List<User> getAllTeachers() {
        return userRepository.getAllTeachers();
    }

    public User getTeacher(Long id) {
        return userRepository.getUserByIdAndTeacherNotNull(id);
    }

    public List<User> getUserByName(String name) {
        return userRepository.getAllByName(name);
    }

    /**
     * using model mapper (seems working)
     */
    public User update(Long id, UserTO userTO) {
        var teacher = userRepository.getOne(id);
        log.info(teacher.toString());
        var user = modelMapper.map(userTO, User.class);
        log.info(user.toString());
        return userRepository.save(user);
    }

    /**
     * Returns teachers who has contract more than 0.
     *
     * @return List of Teacher
     */
    public List<User> getTeachersWhoCan() {
        return userRepository.getTeachersWhoCan();
    }

    /**
     * Returns List of Users who is free today and has contract more than 0.
     * Free in meaning that teacher hasn't any exam today and teacher did not mark this day like unavailable day.
     *
     * @param dateStr String represents the date
     * @return List of User
     */
    public List<User> getAvailableTeachersByDate(String dateStr) {
        var teachersWhoCan = getTeachersWhoCan();
        var examsToday = examService.getByDate(dateStr);
        var teacherExamToday = examsToday
                .stream()
                .map(exam -> exam.getCommission().getTeachers())
                .flatMap(Collection::stream)
                .collect(Collectors.toList());

        return teachersWhoCan
                .stream()
                .filter(teacher -> teacher.getTeacher().getUnavailableDates()
                        .stream()
                        .noneMatch(date -> date.getDate().equals(dateStr)))
                .filter(teacher -> !teacherExamToday.contains(teacher)) //exclude when teacher have exam today
                .collect(Collectors.toList());
    }

    /**
     * Returns exam dates for teacher's calendar. Returns only date where commission's state isn't DRAFT
     *
     * @param teacherId user id
     * @return List of string represents Date in format "01.01.1970"
     */
    public List<String> getExamDates(Long teacherId) {
        var teacher = userRepository.getOne(teacherId);

        return teacher.getTeacher().getCommissionList()
                .stream()
                .filter(commission -> !commission.getState().equals(CommissionState.DRAFT))
                .map(commission -> commission.getExam().getDate())
                .collect(Collectors.toList());
    }

    public void addDate(List<User> list, Date date) {
        for (User t : list)
            addDate(t, date);
    }

    /**
     * Used in teacher calendar
     *
     * @param userId
     * @param dateTO
     * @return
     */
    public User addDate(Long userId, DateTO dateTO) {
        var teacher = userRepository.getOne(userId);
        addDate(teacher, dateService.create(dateTO.getDate()));
        return userRepository.getOne(userId);
    }

    private void addDate(User user, Date date) {
        var storedTeacher = userRepository.getOne(user.getId());
        if (!storedTeacher.getTeacher().getUnavailableDates().contains(date)) {
            storedTeacher.getTeacher().getUnavailableDates().add(date);
        } else {
            log.warning("Teacher already has this date in UnavailableDates List " + date.getDate() + " IMPOSSIBLE SCENARIO 1");
        }
    }

    /**
     * add date to teacher's unavailable dates list.
     *
     * @param teacherId user's id
     * @param dateStr   date
     */
    public void addUnavailableDate(Long teacherId, String dateStr) {
        var teacher = getTeacher(teacherId);

        AtomicBoolean alreadyHas = new AtomicBoolean(false);
        teacher.getTeacher().getUnavailableDates().forEach(date -> {
            if (date.getDate().equals(dateStr)) {
                log.warning("Teacher already has this date in UnavailableDates List " + dateStr + " IMPOSSIBLE SCENARIO 2");
                alreadyHas.set(true);
            }
        });

        if (!alreadyHas.get()) {
            teacher.getTeacher().getUnavailableDates().add(dateService.create(dateStr));
            userRepository.save(teacher);
        }
    }

    public User setNewPassword(NewPassTO newPassTO) {
        var user = userRepository.getOne(newPassTO.getId());
        user.setPassword(newPassTO.getPassword());
        user.setFirstLogin(false);
        return userRepository.save(user);
    }

    public User resetPassword(Long id) {
        var user = userRepository.getOne(id);
        user.setFirstLogin(true);
        user.setPassword(user.getLogin());
        return userRepository.save(user);
    }

    public void removeDate(User teacher, Date date) {
        teacher.getTeacher().getUnavailableDates().removeIf(d -> d.getDate().equals(date.getDate()));
        var t = userRepository.getOne(teacher.getId()).getTeacher().getUnavailableDates();
        dateService.delete(date);
    }

    public User removeDate(Long teacherId, Date date) {
        removeDate(userRepository.getOne(teacherId), date);
        return userRepository.getOne(teacherId);
    }

    public Map<String, Object> getAll(PageRequestTO pageRequestTO) {

        var pageRequest = PageRequest.of(pageRequestTO.getPage(), pageRequestTO.getSize());
        Page<User> page;

        if (pageRequestTO.getPattern() != null && !pageRequestTO.getPattern().equals("")) {
            page = userRepository.findTeacherByNameOrSurnameOrLoginContaining(pageRequestTO.getPattern().toLowerCase(), pageRequest);
        } else {
            page = userRepository.findAll(pageRequest);
        }

        return new PageResponseTO(page).getData();
    }

    public Map<String, Object> getAvailableTeachersByDatePaged(String date, PageRequestTO pageRequestTO) {

        var pageRequest = PageRequest.of(pageRequestTO.getPage(), pageRequestTO.getSize());
        Page<User> page;

        var allIdsByDate = getAvailableTeachersByDate(date)
                .stream().map(AbstractEntity::getId)
                .collect(Collectors.toList());

        if (pageRequestTO.getPattern() != null && !pageRequestTO.getPattern().equals("")) {
            page = userRepository.getUsersByIdByPatternPaged(allIdsByDate, pageRequestTO.getPattern(), pageRequest);
        } else {
            page = userRepository.getUsersByIdPaged(allIdsByDate, pageRequest);
        }

        return new PageResponseTO(page).getData();
    }

    public User updateTeacherProperty(Long id, TeacherPropertyTO teacherPropertyTO) {
        var user = userRepository.getOne(id);
        var teacherProps = user.getTeacher();

        teacherProps.setContract(teacherPropertyTO.getContract());
        teacherProps.setDepartment(teacherPropertyTO.getDepartment());
        teacherProps.setUnavailableDates(teacherPropertyTO.getUnavailableDates());
        teacherProps.setPreferredFieldOfStudies(teacherPropertyTO.getPreferredFieldOfStudies());
        teacherProps.setPositionInCommissions(teacherPropertyTO.getPositionInCommissions());

        user.setTeacher(teacherProps);

        return userRepository.save(user);
    }

    public Map<String, Object> getAllUsersPaged(PageRequestTO request) {
        var pageRequest = PageRequest.of(request.getPage(), request.getSize());

        var allUsers = getAll().stream().map(AbstractEntity::getId).collect(Collectors.toList());
        Page<User> page;

        if (request.getPattern() != null && !request.getPattern().equals("")) {
            page = userRepository.getUsersByIdByPatternPaged(allUsers, request.getPattern(), pageRequest);
        } else {
            page = userRepository.getUsersByIdPaged(allUsers, pageRequest);
        }
        log.info(page.toString());
        return new PageResponseTO(page).getData();

    }

    public List<Role> getAllRoles() {
        return new ArrayList<>(Arrays.asList(Role.ROLE_MANAGER, Role.ROLE_TEACHER));
    }

    public User createNewUser(NewUserTo newUserTo) {
        log.info(newUserTo.toString());

//        var user = new User();
        var user = modelMapper.map(newUserTo, User.class);
        user.setLogin(newUserTo.getEmailAddress().split("@")[0]);
        user.setPassword(newUserTo.getEmailAddress().split("@")[0]);
        user.setFirstLogin(true);
        //TODO figure out with requirement: data.xl -> 2.sheet -> columns F and G

        log.info(user.toString());
        if (newUserTo.getTeacher() != null) {
            var teacherProp = modelMapper.map(newUserTo.getTeacher(), TeacherProperty.class);
            log.info(teacherProp.toString());
            user.setTeacher(teacherProp);
        }
        if (newUserTo.getManager() != null) {
            var managerProp = modelMapper.map(newUserTo.getManager(), ManagerProperty.class);
            log.info(managerProp.toString());
            user.setManager(managerProp);
        }

        log.info(user.toString());

        return userRepository.save(user);

//        return null;
    }

//
//    public void delete(Long id) {
//        userRepository.deleteById(id);
//    }
//
//    public void delete(Teacher teacher) {
//        userRepository.delete(teacher);
//    }
//
//    public void delete() {
//        userRepository.deleteAll();
//    }
//

//

    //
//    public void removeAllDates() {
//        var all = userRepository.findAll();
//        all.forEach(teacher -> teacher.setUnavailableDates(new ArrayList<>()));
//
//    }
//
    @Transactional
    public List<User> readXLS(Integer sheetNumber) {
        if (sheetNumber.equals(4)) {
            var data = csvParser.getData(sheetNumber);
            data.forEach((k, v) -> {
                if (k != 0) {

                    var user = new User();
                    user.setSurname(v.get(0));
                    user.setEmailAddress(v.get(4));
                    user.setLogin(v.get(0));
                    user.setPassword(v.get(0));
                    user.setFirstLogin(true);
                    user.setRole(Role.ROLE_TEACHER);

//                    log.severe(v.get(2));
                    var tProps = new TeacherProperty();
                    tProps.setContract(Double.parseDouble(v.get(2)));
                    tProps.setPositionInCommissions(parsePosition(v.get(4)));

                    user.setTeacher(tProps);
                    userRepository.save(user);

                }
            });
        } else if (sheetNumber.equals(1)) {

//            var data = csvParser.getData(sheetNumber);
//            data.forEach((k, v) -> {
//                if (k != 0) {
//                    var teacher = new Teacher();
//                    var to = new TeacherTO();
//                    to.setTitul(v.get(0));
////                    to.setName(v.get(1));
//                    to.setSurname(v.get(2));
//                    to.setPersonalNumber((int) Double.parseDouble(v.get(4)));
//                    save(teacher, to);
//                }
//            });
        }
        return userRepository.findAll();
    }

    private List<Position> parsePosition(String data) {
        var tokens = Arrays.asList(data.split(","));
        return tokens.stream()
                .map(token -> positionService.getByLetter(token.replaceAll("\\s", "")))
                .collect(Collectors.toList());
    }
}
