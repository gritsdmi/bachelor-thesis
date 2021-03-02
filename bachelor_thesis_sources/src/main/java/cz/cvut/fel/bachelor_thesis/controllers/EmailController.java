package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.Email;
import cz.cvut.fel.bachelor_thesis.services.EmailService;
import cz.cvut.fel.bachelor_thesis.to.EmailTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RequestMapping(value = "/email", produces = {"application/json; charset=UTF-8"})
@RestController
public class EmailController {

    private final EmailService emailService;

    @Autowired
    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public List<Email> getAll() {
        return emailService.getAll();
    }

    @GetMapping("/{id}")
    public Email get(@PathVariable Long id) {
        return emailService.get(id);
    }

    @PostMapping
    public Email create(@RequestBody EmailTO emailTO) {
        return emailService.save(emailTO);
    }

    @PostMapping("/{id}")
    public Email update(@PathVariable Long id, @RequestBody EmailTO to) {
        return emailService.update(id, to);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        emailService.delete(id);
    }
}
