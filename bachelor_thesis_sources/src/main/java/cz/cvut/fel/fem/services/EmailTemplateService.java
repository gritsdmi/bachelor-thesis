package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.EmailTemplate;
import cz.cvut.fel.fem.model.enums.EmailType;
import cz.cvut.fel.fem.repository.EmailTemplateRepository;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Log
@Transactional
@Service
public class EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;

    @Autowired
    public EmailTemplateService(EmailTemplateRepository emailTemplateRepository) {
        this.emailTemplateRepository = emailTemplateRepository;
    }

    public List<EmailTemplate> getAll() {
        return emailTemplateRepository.findAll();
    }

    public EmailTemplate get(Long id) {
        return emailTemplateRepository.getOne(id);
    }

    public EmailTemplate getByType(String emailType) {
        return emailTemplateRepository.findEmailTemplateByEmailType(getType(emailType)).get(0);
    }

    private EmailType getType(String type) {
        EmailType ret = EmailType.FINAL;

        switch (type) {
            case "FINAL":
                ret = EmailType.FINAL;
                break;
            case "NOMINATED":
                ret = EmailType.NOMINATED;
                break;
            case "RECOMMENDED":
                ret = EmailType.RECOMMENDED;
                break;
            default:
                try {
                    throw new Exception(type);
                } catch (Exception e) {
                    e.printStackTrace();
                }
        }
        return ret;
    }

    public EmailTemplate update(EmailTemplate emailTemplate) {
        var template = emailTemplateRepository.getOne(emailTemplate.getId());

        template.setSubject(emailTemplate.getSubject());
        template.setText(emailTemplate.getText());

        return emailTemplateRepository.save(template);
    }

}
