package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.services.CommissionService;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.CommissionTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log
@RequestMapping(value = "/commission", produces = {"application/json; charset=UTF-8"})
public class CommissionController {

    private final CommissionService commissionService;
    private final TeacherService teacherService;

    @Autowired
    public CommissionController(CommissionService commissionService, TeacherService teacherService) {
        this.commissionService = commissionService;
        this.teacherService = teacherService;
    }

    @GetMapping("")
    public List<Commission> getAll() {
        return commissionService.getAll();
    }

    @GetMapping("/{id}")
    public Commission get(@PathVariable Long id) {
        return commissionService.getOne(id);
    }

    @PostMapping("")
    public Commission create(@RequestBody CommissionTO to) {
        return commissionService.save(to);
    }

    @PostMapping("/{id}")
    public Commission update(@PathVariable Long id, @RequestBody CommissionTO to) {
        return commissionService.update(id, to);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commissionService.remove(id);
    }
}
