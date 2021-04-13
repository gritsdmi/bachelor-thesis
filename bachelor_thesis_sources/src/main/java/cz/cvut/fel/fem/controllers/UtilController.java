package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.services.UserService;
import cz.cvut.fel.fem.to.CreatorTO;
import cz.cvut.fel.fem.utils.CommissionMaker;
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
        return commissionMaker.generateCommissions(len, creatorTO);
    }
}
