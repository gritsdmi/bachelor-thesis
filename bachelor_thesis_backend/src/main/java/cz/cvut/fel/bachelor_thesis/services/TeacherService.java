package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.repository.TeacherRepository;
import cz.cvut.fel.bachelor_thesis.to.TeacherTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TeacherService {

    private final TeacherRepository teacherRepository;

    @Autowired
    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
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

    public Teacher update(Long id, TeacherTO teacherTO) {
        var teacher = teacherRepository.getOne(id);

        return save(teacher, teacherTO);
    }

    @Transactional
    Teacher save(Teacher teacher, TeacherTO teacherTO) {

        teacher.setPersonalNumber(teacherTO.getPersonalNumber());
        teacher.setName(teacherTO.getName());
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

        return teacherRepository.save(teacher);
    }

    public void delete(Long id) {
        teacherRepository.deleteById(id);
    }

    public void delete(Teacher teacher) {
        teacherRepository.delete(teacher);
    }
}
