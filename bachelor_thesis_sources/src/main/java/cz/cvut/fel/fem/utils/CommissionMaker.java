package cz.cvut.fel.fem.utils;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.model.enums.PositionEnum;
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
import java.util.Set;
import java.util.stream.Collectors;

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
        teachersFreeToday = teachersFreeToday.stream()
                .filter(user -> correctExamTypeFilter(user, creatorTO))
                .collect(Collectors.toList());

        log.warning("teachersFreeToday size" + String.valueOf(teachersFreeToday.size()));
        log.info("generation start");
        var gen = Generator.combination(teachersFreeToday)
                .simple(len);
        log.info("generation end");

        gen.stream()
                .filter(this::isThereP)
                .forEach(teacherList -> {
                    var comTo = new CommissionTO();
                    comTo.setTeachers(teacherList);
                    commissionService.save(comTo, creatorTO);
                });

        log.info("saving end");

        return commissionService.getDrafts();
    }

    private boolean isThereP(List<User> users) {
        var countP = 0L;
        for (User u : users) {
            countP += u.getTeacher().getPositionInCommissions().stream()
                    .filter(position -> position.getPosition().equals(PositionEnum.P))
                    .count();
        }
        return countP != 0;
    }

    private boolean correctExamTypeFilter(User user, CreatorTO creatorTO) {
        if (user.getTeacher().getCommissionTypes() == null
                || user.getTeacher().getCommissionTypes().equals("")) {
            return false;
        }
        var teacherCommissionTypes = user.getTeacher().getCommissionTypes();
        var degrees = Set.of(teacherCommissionTypes.split(","));

        if (degrees.contains(creatorTO.getDegree().toString())) {
            return true;
        } else {
            return false;
        }
    }

    private boolean teacherHavePermission(List<User> users) {

        var res = true;
        var countP = 0L;
        for (User u : users) {
            countP += u.getTeacher().getPositionInCommissions().stream()
                    .filter(position -> position.getPosition().equals(PositionEnum.P))
                    .count();
        }
        return res;
    }
}
