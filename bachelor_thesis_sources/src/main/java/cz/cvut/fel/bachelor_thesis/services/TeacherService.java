package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.repository.TeacherRepository;
import cz.cvut.fel.bachelor_thesis.to.TeacherTO;
import cz.cvut.fel.bachelor_thesis.utils.CsvParser;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Log
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final CsvParser csvParser;

    @Autowired
    public TeacherService(TeacherRepository teacherRepository, CsvParser csvParser) {
        this.teacherRepository = teacherRepository;
        this.csvParser = csvParser;
    }

    public Teacher create(TeacherTO teacherTO) {
        var teacher = new Teacher();

        return save(teacher, teacherTO);
    }

    public List<Teacher> getAll() {

        return teacherRepository.findAll();
    }

    public Teacher get(Long id) {
        return teacherRepository.getOne(id);
    }

    public List<Teacher> get(String name) {
        return teacherRepository.getAllByName(name);
    }

    public Teacher update(Long id, TeacherTO teacherTO) {
        var teacher = teacherRepository.getOne(id);

        return save(teacher, teacherTO);
    }

    public void updDate(List<Teacher> list, Date date) {
        list.forEach(teacher -> {
            teacherRepository.getOne(teacher.getId()).getUnavailableDates().add(date);
        });
    }

    @Transactional
    Teacher save(Teacher teacher, TeacherTO teacherTO) {
        //todo convertor DTO to model
        //existuji automaticke convertory
        teacher.setPersonalNumber(teacherTO.getPersonalNumber());
        teacher.setName(teacherTO.getName());
        teacher.setSurname(teacherTO.getSurname());
        teacher.setEmailAddress(teacherTO.getEmailAddress());
        teacher.setLogin(teacherTO.getLogin());
        teacher.setPassword(teacherTO.getPassword());
        teacher.setFirstLogin(teacherTO.getFirstLogin());
        teacher.setDegree(teacherTO.getDegree());
        teacher.setCommissionList(teacherTO.getCommissionList());
        teacher.setUnavailableDates(teacherTO.getUnavailableDates());
        teacher.setEmailAddress(teacherTO.getEmailAddress());
        teacher.setContract(teacherTO.getContract());
        teacher.setPosition(teacherTO.getPosition());
        teacher.setTitul(teacherTO.getTitul());
        teacher.setDepartment(teacherTO.getDepartment());

        return teacherRepository.save(teacher);
    }

    public void delete(Long id) {
        teacherRepository.deleteById(id);
    }

    public void delete(Teacher teacher) {
        teacherRepository.delete(teacher);
    }

    public void delete() {
        teacherRepository.deleteAll();
    }

    public List<Teacher> getTeachersWhoCan() {
        return teacherRepository.getTeachersWhoCan();
    }

    public List<Teacher> getAvailableTeachersByDate(String dateStr) {
        var teachersWhoCan = getTeachersWhoCan();

        log.warning(teachersWhoCan.toString());
        var canToday = teachersWhoCan
                .stream()
                .filter(teacher -> teacher.getUnavailableDates()
                        .stream()
                        .noneMatch(date -> date.getDate().equals(dateStr)))
                .collect(Collectors.toList());

        log.warning(canToday.toString());
        return canToday;

    }

    public void removeAllDates() {
        var all = teacherRepository.findAll();
        all.forEach(teacher -> teacher.setUnavailableDates(new ArrayList<>()));

    }

    @Transactional
    public List<Teacher> readXLS(Integer sheetNumber) {
        if (sheetNumber.equals(4)) {
            var data = csvParser.getData(sheetNumber);
            data.forEach((k, v) -> {
                if (k != 0) {
                    var teacher = new Teacher();
                    var to = new TeacherTO();
                    to.setSurname(v.get(0));
                    to.setContract(Double.parseDouble(v.get(2)));
                    to.setEmailAddress(v.get(4));
                    save(teacher, to);
                }
            });
        } else if (sheetNumber.equals(1)) {

            var data = csvParser.getData(sheetNumber);
            data.forEach((k, v) -> {
                if (k != 0) {
                    var teacher = new Teacher();
                    var to = new TeacherTO();
                    to.setTitul(v.get(0));
//                    to.setName(v.get(1));
                    to.setSurname(v.get(2));
                    to.setPersonalNumber((int) Double.parseDouble(v.get(4)));
                    save(teacher, to);
                }
            });
        }
        return teacherRepository.findAll();
    }
}
