package cz.cvut.fel.fem.controllers;

import cz.cvut.fel.fem.model.Email;
import cz.cvut.fel.fem.model.enums.EmailType;
import cz.cvut.fel.fem.services.EmailService;
import cz.cvut.fel.fem.services.EmailTemplateService;
import cz.cvut.fel.fem.to.EmailTO;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log
@RequestMapping(value = "/email", produces = {"application/json; charset=UTF-8"})
@RestController
public class EmailController implements Controller {

    private final EmailService emailService;

    private final EmailTemplateService emailTemplateService;

    @Autowired
    public EmailController(EmailService emailService, EmailTemplateService emailTemplateService) {
        this.emailService = emailService;
        this.emailTemplateService = emailTemplateService;
    }

    @GetMapping
    public List<Email> getAll() {
        return emailService.getAll();
    }

    @GetMapping("/{id}")
    public Email get(@PathVariable Long id) {
        return emailService.get(id);
    }

    @GetMapping("/types")
    public List<EmailType> get() {
        return emailService.getTypes();
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
