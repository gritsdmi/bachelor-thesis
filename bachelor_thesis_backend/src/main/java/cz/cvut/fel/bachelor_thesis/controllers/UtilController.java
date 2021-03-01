package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Log
@RequestMapping(value = "/util", produces = {"application/json; charset=UTF-8"})
public class UtilController {

    private final TeacherService teacherService;

    @Autowired
    public UtilController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/{sheetNumber}")
    public void parseCSV(@PathVariable Integer sheetNumber) {
        log.warning("parser csv called with argument 4");
        teacherService.readXLS(sheetNumber);

    }
}
