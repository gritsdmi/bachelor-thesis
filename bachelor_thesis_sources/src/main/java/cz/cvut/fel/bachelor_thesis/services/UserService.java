package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.model.Position;
import cz.cvut.fel.bachelor_thesis.model.TeacherProperty;
import cz.cvut.fel.bachelor_thesis.model.User;
import cz.cvut.fel.bachelor_thesis.repository.UserRepository;
import cz.cvut.fel.bachelor_thesis.to.DateTO;
import cz.cvut.fel.bachelor_thesis.to.UserTO;
import cz.cvut.fel.bachelor_thesis.utils.CsvParser;
import lombok.extern.java.Log;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
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

    //playing with model mapper
    private User convertToEntity(UserTO postDto) throws ParseException {
//        Post post = modelMapper.map(postDto, Post.class);
//        post.setSubmissionDate(postDto.getSubmissionDateConverted(
//                userService.getCurrentUser().getPreference().getTimezone()));
//
//        if (postDto.getId() != null) {
//            Post oldPost = postService.getPostById(postDto.getId());
//            post.setRedditID(oldPost.getRedditID());
//            post.setSent(oldPost.isSent());
//        }
//        return post;
        return null;
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
     * Returns List of Users who is free today.
     * Free in meaning that teacher hasn't any exam today and teacher did not mark this day like unavailable.
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

    public List<String> getExamDates(Long teacherId) {
        var teacher = userRepository.getOne(teacherId);

        return teacher.getTeacher().getCommissionList()
                .stream()
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
            log.warning("Teacher already has this date in UnavailableDates List " + date.getDate() + " IMPOSSIBLE SCENARIO");
        }
    }

    /**
     * add date to teacher's unavailable dates list.
     *
     * @param teacherId
     * @param dateStr
     */
    public void addUnavailableDate(Long teacherId, String dateStr) {
        var teacher = getTeacher(teacherId);

        AtomicBoolean alreadyHas = new AtomicBoolean(false);
        teacher.getTeacher().getUnavailableDates().forEach(date -> {
            if (date.getDate().equals(dateStr)) {
                log.warning("Teacher already has this date in UnavailableDates List " + dateStr + " IMPOSSIBLE SCENARIO");
                alreadyHas.set(true);
            }
        });

        if (!alreadyHas.get()) {
            teacher.getTeacher().getUnavailableDates().add(dateService.create(dateStr));
            userRepository.save(teacher);
        }
    }

//    public void removeDate(Teacher teacher, Date date) {
//        System.out.println(teacher.getUnavailableDates());
//        teacher.getUnavailableDates().removeIf(d -> d.getDate().equals(date.getDate()));
//        var t = userRepository.getOne(teacher.getId()).getUnavailableDates();
//        System.out.println(t);
//    }
//
//    public Teacher removeDate(Long teacherId, Date date) {
//        removeDate(userRepository.getOne(teacherId), date);
//        return userRepository.getOne(teacherId);
//    }
//

//
//    @Transactional
//    Teacher save(Teacher teacher, TeacherTO teacherTO) {
//        //todo convertor DTO to model
//        //existuji automaticke convertory
//        teacher.setPersonalNumber(teacherTO.getPersonalNumber());
//        teacher.setName(teacherTO.getName());
//        teacher.setSurname(teacherTO.getSurname());
//        teacher.setEmailAddress(teacherTO.getEmailAddress());
//        teacher.setLogin(teacherTO.getLogin());
//        teacher.setPassword(teacherTO.getPassword());
//        teacher.setFirstLogin(teacherTO.getFirstLogin());
//        teacher.setDegree(teacherTO.getDegree());
//        teacher.setCommissionList(teacherTO.getCommissionList());
//        teacher.setUnavailableDates(teacherTO.getUnavailableDates());
//        teacher.setEmailAddress(teacherTO.getEmailAddress());
//        teacher.setContract(teacherTO.getContract());
//        teacher.setPosition(teacherTO.getPosition());
//        teacher.setTitul(teacherTO.getTitul());
//        teacher.setDepartment(teacherTO.getDepartment());
//
//        return userRepository.save(teacher);
//    }
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
//                    var teacher = new Teacher();
//                    var to = new TeacherTO();
//                    to.setSurname(v.get(0));
//                    to.setContract(Double.parseDouble(v.get(2)));
//                    to.setEmailAddress(v.get(4));
//                    save(teacher, to);

                    var user = new User();
                    user.setSurname(v.get(0));
                    user.setEmailAddress(v.get(4));
                    user.setLogin(v.get(0));
                    user.setPassword(v.get(0));
                    user.setFirstLogin(true);

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
