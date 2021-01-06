package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.TO.TeacherTO;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Transactional
    public Teacher createTeacher(TeacherTO teacherTO) {
        var teacher = new Teacher();

        teacher.setDegree(teacherTO.getDegree());
        teacher.setName(teacherTO.getName());
        teacher.setCommissionList(teacherTO.getCommissionList());
        teacher.setEmailAddress(teacherTO.getEmailAddress());

        return teacherRepository.save(teacher);
    }
}
