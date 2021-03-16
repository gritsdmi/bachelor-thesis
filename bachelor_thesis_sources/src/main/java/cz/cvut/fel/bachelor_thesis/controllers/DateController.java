//package cz.cvut.fel.bachelor_thesis.controllers;
//
//import cz.cvut.fel.bachelor_thesis.to.DateTO;
//import lombok.extern.java.Log;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@Log
//@RequestMapping(value = "/date", produces = {"application/json; charset=UTF-8"})
//public class DateController {
//
//    private final DateService dateService;
//
//    @Autowired
//    public DateController(DateService dateService) {
//        this.dateService = dateService;
//    }
//
//    @GetMapping
//    public List<Date> getAll() {
//        return dateService.getAll();
//    }
//
//    @GetMapping("/{id}")
//    public Date get(@PathVariable Long id) {
//        return dateService.get(id);
//    }
//
//    @PostMapping
//    public Date create(@RequestBody DateTO date) {
//        return dateService.save(date);
//    }
//
//    @PostMapping("/{id}")
//    public Date update(@PathVariable Long id, @RequestBody DateTO to) {
//        return dateService.update(id, to);
//    }
//
//    @DeleteMapping("/{id}")
//    public void delete(@PathVariable Long id) {
//        dateService.delete(id);
//    }
//}
