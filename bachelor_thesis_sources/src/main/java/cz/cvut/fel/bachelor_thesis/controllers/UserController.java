package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.User;
import cz.cvut.fel.bachelor_thesis.services.UserService;
import cz.cvut.fel.bachelor_thesis.to.DateTO;
import cz.cvut.fel.bachelor_thesis.to.UserTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log
@RequestMapping(value = "/user", produces = {"application/json; charset=UTF-8"})
public class UserController implements Controller {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> get() {
        return userService.getAll();
    }

    @GetMapping("/teacher")
    public List<User> getTeachers() {
        return userService.getAllTeachers();
    }

    @GetMapping("/teacher/{id}")
    public User get(@PathVariable Long id) {
        return userService.getTeacher(id);
    }

    @GetMapping("/teacher/date/{date}")
    public List<User> getByDate(@PathVariable String date) {
        return userService.getAvailableTeachersByDate(date);
    }

    @GetMapping("/teacher/{teacherId}/examDates")
    public List<String> getExamDates(@PathVariable Long teacherId) {
        return userService.getExamDates(teacherId);
    }

    @PostMapping("/teacher/{id}")
    public User update(@PathVariable Long id, @RequestBody UserTO userTO) {
        return userService.update(id, userTO);
    }

    @PostMapping("/teacher/{teacherId}/addDate")
    public User addDateToUnavailable(@PathVariable Long teacherId, @RequestBody DateTO dateTO) {
        return userService.addDate(teacherId, dateTO);
    }

}
