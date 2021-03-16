package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.CreatorTO;
import cz.cvut.fel.bachelor_thesis.utils.CommissionMaker;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log
@RequestMapping(value = "/util", produces = {"application/json; charset=UTF-8"})
public class UtilController implements Controller {

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

    @PostMapping("/gen/{len}")
    public List<Commission> generate(@PathVariable Integer len,
                                     @RequestBody CreatorTO creatorTO) {
//        return commissionMaker.test(len);
        return commissionMaker.test2(len, creatorTO);
    }
}
