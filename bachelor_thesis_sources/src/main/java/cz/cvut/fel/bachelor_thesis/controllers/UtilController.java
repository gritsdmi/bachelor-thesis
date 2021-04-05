package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.User;
import cz.cvut.fel.bachelor_thesis.services.UserService;
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

    private final UserService userService;
    private final CommissionMaker commissionMaker;

    @Autowired
    public UtilController(UserService userService, CommissionMaker commissionMaker) {
        this.userService = userService;
        this.commissionMaker = commissionMaker;
    }

    @GetMapping("/{sheetNumber}")
    public List<User> parseCSV(@PathVariable Integer sheetNumber) {
        log.warning("parser csv called with argument 4");
        return userService.readXLS(sheetNumber);
    }

    @PostMapping("/gen/{len}")
    public List<Commission> generate(@PathVariable Integer len,
                                     @RequestBody CreatorTO creatorTO) {
//        return commissionMaker.test(len);
        return commissionMaker.generateCommissions(len, creatorTO);
    }
}
