package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.utils.CommissionMaker;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Log
@RequestMapping(value = "/util", produces = {"application/json; charset=UTF-8"})
public class UtilController {

    private final TeacherService teacherService;
    private final CommissionMaker commissionMaker;

    @Autowired
    public UtilController(TeacherService teacherService, CommissionMaker commissionMaker) {
        this.teacherService = teacherService;
        this.commissionMaker = commissionMaker;
    }

    @GetMapping("/{sheetNumber}")
    public List<Teacher> parseCSV(@PathVariable Integer sheetNumber) {
        log.warning("parser csv called with argument 4");
        return teacherService.readXLS(sheetNumber);
    }

    @GetMapping("/gen/{len}")
    public List<Commission> generate(@PathVariable Integer len) {
        return commissionMaker.test(len);
    }
}
