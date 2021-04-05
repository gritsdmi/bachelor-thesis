package cz.cvut.fel.fem.utils;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.services.CommissionService;
import cz.cvut.fel.fem.services.UserService;
import cz.cvut.fel.fem.to.CommissionTO;
import cz.cvut.fel.fem.to.CreatorTO;
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

    private final UserService userService;

    @Autowired
    public CommissionMaker(CommissionService commissionService, UserService userService) {
        this.commissionService = commissionService;
        this.userService = userService;
    }

    /**
     * used on autogenerate page
     */
    @Transactional
    public List<Commission> generateCommissions(Integer len, CreatorTO creatorTO) {
        log.warning(creatorTO.toString());

        var teachersFreeToday = userService.getAvailableTeachersByDate(creatorTO.getDate());
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
