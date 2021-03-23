package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.services.CommissionService;
import cz.cvut.fel.bachelor_thesis.services.TeacherService;
import cz.cvut.fel.bachelor_thesis.to.CreatorTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@Log
@RequestMapping(value = "/commission", produces = {"application/json; charset=UTF-8"})
public class CommissionController implements Controller {

    private final CommissionService commissionService;
    private final TeacherService teacherService;

    @Autowired
    public CommissionController(CommissionService commissionService, TeacherService teacherService) {
        this.commissionService = commissionService;
        this.teacherService = teacherService;
    }

    @GetMapping
    public List<Commission> getAll() {
        log.info("/commission/get request received");
        var temp = commissionService.getAll();
        Collections.shuffle(temp);
        temp = temp.subList(0, temp.size() / 10);
        log.warning(String.valueOf(temp.size()));
        return temp;
    }

    @GetMapping("/draft")
    public List<Commission> getDraft() {
        return commissionService.getDrafts();
    }

    @GetMapping("/notDraft")
    public List<Commission> getOthers() {
        return commissionService.getNotDraft();
    }

    @GetMapping("/{id}")
    public Commission get(@PathVariable Long id) {
        return commissionService.getOne(id);
    }

    @PostMapping("/create")
    public Commission create(@RequestBody CreatorTO to) {
        log.warning(to.toString());
        return commissionService.saveManual(to);
    }

    @PostMapping("/{commId}/nextState")
    public Commission nextState(@PathVariable Long commId, @RequestBody Commission commission) {
        return commissionService.updateToEditedState(commId, commission);
    }

    @PostMapping("/{id}")
    public Commission update(@PathVariable Long id, @RequestBody Commission commission) {
        return commissionService.update(id, commission);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        commissionService.remove(id);
    }

    @DeleteMapping
    public void deleteAll() {
        commissionService.remove();
    }
}
