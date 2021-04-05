package cz.cvut.fel.bachelor_thesis.utils;

import cz.cvut.fel.bachelor_thesis.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Generator {


    @Autowired
    private UserService userService;

    public Generator() {

    }

//    public void createUser() {
//        var newTeacherTO = new TeacherTO();
//        newTeacherTO.setName("Sebek");
//        newTeacherTO.setPersonalNumber(001);
//        newTeacherTO.setFirstLogin(true);
//        newTeacherTO.setEmailAddress("sebekji1@fel.cvut.cz");
//        newTeacherTO.setUnavailableDates(new ArrayList<>());
////        newTeacherTO.setCommissionList(new ArrayList<>());
//
//        teacherService.createTeacher(newTeacherTO);
//
//    }
}
