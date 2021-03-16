package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import cz.cvut.fel.bachelor_thesis.services.ExamService;
import cz.cvut.fel.bachelor_thesis.to.ExamTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RequestMapping(value = "/exam", produces = {"application/json; charset=UTF-8"})
@RestController
public class ExamController implements Controller {

    private final ExamService examService;

    @Autowired
    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping
    public List<Exam> getAll() {
        return examService.getAll();
    }

    @GetMapping("/{id}")
    public Exam get(@PathVariable Long id) {
        return examService.get(id);
    }

    @GetMapping("/degrees")
    public List<Degree> getDegrees() {
        return examService.getDegrees();
    }

    @PostMapping
    public Exam create(@RequestBody ExamTO examTO) {
        return examService.save(examTO);
    }

    @PostMapping("/{id}")
    public Exam update(@PathVariable Long id, @RequestBody ExamTO to) {
        return examService.update(id, to);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        examService.delete(id);
    }

}
