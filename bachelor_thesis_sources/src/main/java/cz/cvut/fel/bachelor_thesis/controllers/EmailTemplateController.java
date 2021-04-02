package cz.cvut.fel.bachelor_thesis.controllers;

import cz.cvut.fel.bachelor_thesis.model.EmailTemplate;
import cz.cvut.fel.bachelor_thesis.services.EmailTemplateService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/template", produces = {"application/json; charset=UTF-8"})
@Log
public class EmailTemplateController implements Controller {

    @Autowired
    private EmailTemplateService emailTemplateService;

    @GetMapping
    public List<EmailTemplate> get() {
        return emailTemplateService.getAll();
    }

    @GetMapping("/{id}")
    public EmailTemplate get(@PathVariable Long id) {
        return emailTemplateService.get(id);
    }

    @PostMapping()
    public EmailTemplate update(@RequestBody EmailTemplate emailTemplate) {
        return emailTemplateService.update(emailTemplate);
    }
}
