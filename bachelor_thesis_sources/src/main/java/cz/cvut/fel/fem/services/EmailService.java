package cz.cvut.fel.fem.services;

import cz.cvut.fel.fem.model.Email;
import cz.cvut.fel.fem.model.enums.EmailType;
import cz.cvut.fel.fem.repository.EmailRepository;
import cz.cvut.fel.fem.to.EmailTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private EmailRepository emailRepository;

    @Qualifier("getMailSender")
    @Autowired
    private JavaMailSender emailSender;

    public Email get(Long emailId) {
        return emailRepository.getOne(emailId);
    }

    public List<Email> getAll() {
        return emailRepository.findAll();
    }

    public List<EmailType> getTypes() {
        return new ArrayList<>(Arrays.asList(EmailType.FINAL, EmailType.NOMINATED, EmailType.RECOMMENDED));
    }

    public Email save(EmailTO emailTO) {
        var email = new Email();

        email.setAuthor(emailTO.getAuthor());
        email.setMessageText(email.getMessageText());
        email.setTo(emailTO.getTo());
        email.setType(email.getType());

        return emailRepository.save(email);
    }

    public Email update(Long emailId, EmailTO emailTO) {

        var email = emailRepository.getOne(emailId);

        email.setAuthor(emailTO.getAuthor());
        email.setMessageText(email.getMessageText());
        email.setTo(emailTO.getTo());
        email.setType(email.getType());

        return emailRepository.save(email);
    }

    public void delete(Long id) {
        emailRepository.deleteById(id);
    }

    public void delete(Email email) {
        emailRepository.delete(email);
    }

    public void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@baeldung.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    public void sendEmail(EmailTO emailTO) {
//        var from = emailTO.getAuthor().getEmailAddress();
        var text = emailTO.getMessageText();
        var subject = emailTO.getSubject();

        sendSimpleMessage(emailTO.getEmailTO(), subject, text);

//        emailTO.getTo().forEach(user -> sendSimpleMessage(user.getEmailAddress(), subject, text));
    }
}
