package cz.cvut.fel.bachelor_thesis.services;

import cz.cvut.fel.bachelor_thesis.model.Email;
import cz.cvut.fel.bachelor_thesis.repository.EmailRepository;
import cz.cvut.fel.bachelor_thesis.to.EmailTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmailService {

    @Autowired
    private EmailRepository emailRepository;

    public Email get(Long emailId) {
        return emailRepository.getOne(emailId);
    }

    public List<Email> getAll() {
        return emailRepository.findAll();
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
}
