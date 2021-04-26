package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.FieldOfStudy;
import cz.cvut.fel.fem.model.enums.Degree;
import cz.cvut.fel.fem.services.FieldOfStudyService;
import cz.cvut.fel.fem.to.FieldOfStudyTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RequestMapping(value = "/field", produces = {"application/json; charset=UTF-8"})
@RestController
public class FieldOfStudyController implements Controller {

    private final FieldOfStudyService fieldOfStudyService;

    @Autowired
    public FieldOfStudyController(FieldOfStudyService fieldOfStudyService) {
        this.fieldOfStudyService = fieldOfStudyService;
    }

    @GetMapping
    public List<FieldOfStudy> getAll() {
        return fieldOfStudyService.getAll();
    }

    @GetMapping("/{id}")
    public FieldOfStudy get(@PathVariable Long id) {
        return fieldOfStudyService.get(id);
    }

    @GetMapping("/degree/{degree}")
    public List<FieldOfStudy> getByDegree(@PathVariable Degree degree) {
        return fieldOfStudyService.getByDegree(degree);
    }

    @GetMapping("byName/{name}")
    public FieldOfStudy getByName(@PathVariable String name) {
        return fieldOfStudyService.getByName(name);
    }

    @PostMapping
    public FieldOfStudy create(@RequestBody FieldOfStudyTO fieldOfStudyTO) {
        return fieldOfStudyService.save(fieldOfStudyTO);
    }

    @PostMapping("/{id}")
    public FieldOfStudy update(@PathVariable Long id, @RequestBody FieldOfStudyTO to) {
        return fieldOfStudyService.update(id, to);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        fieldOfStudyService.delete(id);
    }

}
