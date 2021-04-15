package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Date;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.model.auth.NewPassTO;
import cz.cvut.fel.fem.services.UserService;
import cz.cvut.fel.fem.to.DateTO;
import cz.cvut.fel.fem.to.TeacherPropertyTO;
import cz.cvut.fel.fem.to.UserTO;
import cz.cvut.fel.fem.to.page.PageRequestTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @PostMapping("/teacher/prop/{id}")
    public User updateTeacherProperty(@PathVariable Long id, @RequestBody TeacherPropertyTO teacherPropertyTO) {
        return userService.updateTeacherProperty(id, teacherPropertyTO);
    }

    @PostMapping("/teacher/{id}")
    public User update(@PathVariable Long id, @RequestBody UserTO userTO) {
        return userService.update(id, userTO);
    }

    @PostMapping("/teacher/{teacherId}/addDate")
    public User addDateToUnavailable(@PathVariable Long teacherId, @RequestBody DateTO dateTO) {
        return userService.addDate(teacherId, dateTO);
    }

    @PostMapping("/teacher/pass")
    public User setNewPassword(@RequestBody NewPassTO newPassTO) {
        log.warning(newPassTO.toString());
        return userService.setNewPassword(newPassTO);
    }

    @PostMapping("/teacher/{teacherId}/removeDate")
    public User removeDate(@PathVariable Long teacherId, @RequestBody Date date) {
        return userService.removeDate(teacherId, date);
    }

    @PostMapping("/teacher/page")
    public Map<String, Object> getAllTeachersPaged(@RequestBody PageRequestTO pageRequestTO) {
        return userService.getAll(pageRequestTO);
    }

    @PostMapping("/teacher/date/{date}/page")
    public Map<String, Object> getByDate(@PathVariable String date, @RequestBody PageRequestTO pageRequestTO) {
        return userService.getAvailableTeachersByDatePaged(date, pageRequestTO);
    }


}
