//package cz.cvut.fel.fem.controllers;
//
//import cz.cvut.fel.fem.model.Date;
//import cz.cvut.fel.fem.model.Teacher;
//import cz.cvut.fel.fem.services.UserService;
//import cz.cvut.fel.fem.to.DateTO;
//import cz.cvut.fel.fem.to.TeacherTO;
//import lombok.extern.java.Log;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@Log
//@RequestMapping(value = "/teacher", produces = {"application/json; charset=UTF-8"})
//@RestController
//public class TeacherController implements Controller {
//
//    private final UserService userService;
//
//    @Autowired
//    public TeacherController(UserService userService) {
//        this.userService = userService;
//    }
//
//    @GetMapping
//    public List<Teacher> getAll() {
//        return userService.getAll();
//    }
//
//    @GetMapping("/can")
//    public List<Teacher> test() {
//        return userService.getTeachersWhoCan();
//    }
//
//    @GetMapping("/{id}")
//    public Teacher get(@PathVariable Long id) {
//        return userService.get(id);
//    }
//
//    @GetMapping("/date/{date}")
//    public List<Teacher> getByDate(@PathVariable String date) {
//        return userService.getAvailableTeachersByDate(date);
//    }
//
//    @GetMapping("/{teacherId}/examDates")
//    public List<Date> getExamDates(@PathVariable Long teacherId) {
//        return userService.getExamDates(teacherId);
//    }
//
////    @GetMapping("/{name}")
////    public List<Teacher> get(@PathVariable String name) {
////        log.warning("this name");
////
////        return teacherService.get(name);
////    }
//
//    @PostMapping
//    public Teacher create(@RequestBody TeacherTO teacherTO) {
//        return userService.create(teacherTO);
//    }
//
//    @PostMapping("/{id}")
//    public Teacher update(@PathVariable Long id, @RequestBody TeacherTO to) {
//        log.warning("request post " + to.toString());
//        return userService.update(id, to);
//    }
//
//    @PostMapping("/{teacherId}/addDate")
//    public Teacher addDate(@PathVariable Long teacherId, @RequestBody DateTO dateTO) {
//        return userService.addDate(teacherId, dateTO);
//    }
//
//    @PostMapping("/{teacherId}/removeDate")
//    public Teacher removeDate(@PathVariable Long teacherId, @RequestBody Date date) {
//        return userService.removeDate(teacherId, date);
//    }
//
//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable Long id) {
//        userService.delete(id);
//    }
//
//    @DeleteMapping
//    public void delete() {
//        userService.delete();
//    }
//
//}
