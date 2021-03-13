package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.repository.EmailTemplateRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Log
@Transactional
public class EmailTemplateService {

    private EmailTemplateRepository emailTemplateRepository;

    @Autowired
    public EmailTemplateService(EmailTemplateRepository emailTemplateRepository) {
        this.emailTemplateRepository = emailTemplateRepository;
    }
}
