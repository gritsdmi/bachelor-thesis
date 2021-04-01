package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.DateTO;
import cz.cvut.fel.bachelor_thesis.to.TeacherTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RequestMapping(value = "/teacher", produces = {"application/json; charset=UTF-8"})
@RestController
public class TeacherController implements Controller {

    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<Teacher> getAll() {
        return teacherService.getAll();
    }

    @GetMapping("/can")
    public List<Teacher> test() {
        return teacherService.getTeachersWhoCan();
    }

    @GetMapping("/{id}")
    public Teacher get(@PathVariable Long id) {
        return teacherService.get(id);
    }

    @GetMapping("/date/{date}")
    public List<Teacher> getByDate(@PathVariable String date) {
        return teacherService.getAvailableTeachersByDate(date);
    }

    @GetMapping("/{teacherId}/examDates")
    public List<Date> getExamDates(@PathVariable Long teacherId) {
        return teacherService.getExamDates(teacherId);
    }

//    @GetMapping("/{name}")
//    public List<Teacher> get(@PathVariable String name) {
//        log.warning("this name");
//
//        return teacherService.get(name);
//    }

    @PostMapping
    public Teacher create(@RequestBody TeacherTO teacherTO) {
        return teacherService.create(teacherTO);
    }

    @PostMapping("/{id}")
    public Teacher update(@PathVariable Long id, @RequestBody TeacherTO to) {
        log.warning("request post " + to.toString());
        return teacherService.update(id, to);
    }

    @PostMapping("/{teacherId}/addDate")
    public Teacher addDate(@PathVariable Long teacherId, @RequestBody DateTO dateTO) {
        return teacherService.addDate(teacherId, dateTO);
    }

    @PostMapping("/{teacherId}/removeDate")
    public Teacher removeDate(@PathVariable Long teacherId, @RequestBody Date date) {
        return teacherService.removeDate(teacherId, date);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        teacherService.delete(id);
    }

    @DeleteMapping
    public void delete() {
        teacherService.delete();
    }

}
