package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Commission;
import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.services.CommissionService;
import cz.cvut.fel.fem.to.CreatorTO;
import cz.cvut.fel.fem.to.page.PageRequestTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@Log
@RequestMapping(value = "/commission", produces = {"application/json; charset=UTF-8"})
public class CommissionController implements Controller {

    private final CommissionService commissionService;

    @Autowired
    public CommissionController(CommissionService commissionService) {
        this.commissionService = commissionService;
    }

    @GetMapping
    public List<Commission> getAll() {
        var temp = commissionService.getAll();
        Collections.shuffle(temp);
//        temp = temp.subList(0, temp.size() / 10);
//        log.warning(String.valueOf(temp.size()));
        return temp;
    }

    /**
     * for test new mapping
     */
    @PostMapping("/{comId}/{teacherId}")
    public Commission addTeacher(@PathVariable Long comId, @PathVariable Long teacherId) {
        return commissionService.addTeacherById(comId, teacherId);
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

    @GetMapping("/byTeacher/{teacherId}")
    public List<Commission> getByTeacher(@PathVariable Long teacherId) {
        return commissionService.getByTeacher(teacherId);
    }

    @PostMapping("/replace/{commId}/{teacherIdToRemove}")
    public Commission replaceTeacher(@PathVariable Long commId,
                                     @PathVariable Long teacherIdToRemove,
                                     @RequestBody User teacherToRecommend) {
        log.warning("replacing teacher");
        return commissionService.addTeacherToCommission(teacherToRecommend, commId, teacherIdToRemove);
    }

    @PostMapping("/create")
    public Commission create(@RequestBody CreatorTO to) {
        return commissionService.saveManual(to);
    }

    @PostMapping("/{commId}/toEditState")
    public List<Commission> nextState(@PathVariable Long commId) {
        commissionService.updateToEditedState(commId);
        return commissionService.getDrafts();
    }

    @PostMapping("/{id}")
    public Commission update(@PathVariable Long id, @RequestBody Commission commission) {
        return commissionService.update(id, commission);
    }

    @PostMapping("/page")
    public Map<String, Object> getCommissionsPaged(@RequestBody PageRequestTO pageRequestTO) {
        return commissionService.getAll(pageRequestTO);
    }

    @PostMapping("/byTeacher/{teacherId}/page")
    public Map<String, Object> getByTeacher(@PathVariable Long teacherId, @RequestBody PageRequestTO pageRequestTO) {
        return commissionService.getByTeacher(teacherId, pageRequestTO);
    }

    @PostMapping("/draft/page")
    public Map<String, Object> getDraftPaged(@RequestBody PageRequestTO pageRequestTO) {
        return commissionService.getAllDrafts(pageRequestTO);
    }


//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable Long id) {
//        commissionService.remove(id);
//    }
//
//    @DeleteMapping
//    public void deleteAll() {
//        commissionService.remove();
//    }
}
