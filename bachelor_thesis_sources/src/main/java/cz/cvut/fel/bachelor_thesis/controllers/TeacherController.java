package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.TeacherTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RequestMapping(value = "/teacher", produces = {"application/json; charset=UTF-8"})
@RestController
public class TeacherController {

    private final TeacherService teacherService;

    @Autowired
    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<Teacher> getAll() {
        return teacherService.getAll();
    }

    @GetMapping("/{id}")
    public Teacher get(@PathVariable Long id) {
        return teacherService.get(id);
    }

    @PostMapping
    public Teacher create(@RequestBody TeacherTO teacherTO) {
        return teacherService.create(teacherTO);
    }

    @PostMapping("/{id}")
    public Teacher update(@PathVariable Long id, @RequestBody TeacherTO to) {
        return teacherService.update(id, to);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        teacherService.delete(id);
    }

}
