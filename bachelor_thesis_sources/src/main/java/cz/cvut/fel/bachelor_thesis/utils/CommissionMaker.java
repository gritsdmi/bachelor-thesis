package cz.cvut.fel.bachelor_thesis.utils;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.services.CommissionService;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.CommissionTO;
import lombok.extern.java.Log;
import org.paukov.combinatorics3.Generator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Log
@Service
//simple combination
public class CommissionMaker {

    private final CommissionService commissionService;
    private final TeacherService teacherService;

    @Autowired
    public CommissionMaker(CommissionService commissionService, TeacherService teacherService) {
        this.commissionService = commissionService;
        this.teacherService = teacherService;
    }

    @Transactional
    public List<Commission> test(Integer len) {
        log.warning("generator starting");
        var teachers = teacherService.getAll();
        var commissionsList = new ArrayList<Commission>();
        Generator.combination(teachers)
                .simple(len)
                .stream()
                .forEach(pair -> {
                    var comTo = new CommissionTO();
                    comTo.setTeachers(pair);
                    commissionsList.add(commissionService.save(comTo));
                });
        log.warning("generator ends");
        return commissionService.getAll();
    }
}
