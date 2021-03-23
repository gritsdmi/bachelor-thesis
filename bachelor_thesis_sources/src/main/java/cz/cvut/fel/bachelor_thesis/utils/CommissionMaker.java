package cz.cvut.fel.bachelor_thesis.utils;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.services.CommissionService;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.CommissionTO;
import cz.cvut.fel.bachelor_thesis.to.CreatorTO;
import lombok.extern.java.Log;
import org.paukov.combinatorics3.Generator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

//    @Transactional
//    public List<Commission> test(Integer len) {
//        log.warning("generator starting");
//
//        //todo add logic here
//        var teachers = teacherService.getAll();
//
//        var commissionsList = new ArrayList<Commission>();
//        Generator.combination(teachers)
//                .simple(len)
//                .stream()
//                .forEach(pair -> {
//                    var comTo = new CommissionTO();
//                    comTo.setTeachers(pair);
//                    commissionsList.add(commissionService.save(comTo));
//                });
//        log.warning("generator ends");
//        return commissionService.getAll();
//    }

    @Transactional
    public List<Commission> test2(Integer len, CreatorTO creatorTO) {
        log.warning(creatorTO.toString());

        var teachersFreeToday = teacherService.getAvailableTeachersByDate(creatorTO.getDate());
        //todo add logic(titul, pozice)
        Generator.combination(teachersFreeToday)
                .simple(len)
                .stream()
                .forEach(teacherList -> {
                    var comTo = new CommissionTO();
                    comTo.setTeachers(teacherList);
                    commissionService.save(comTo, creatorTO);
                });
        return commissionService.getDrafts();
    }
}
