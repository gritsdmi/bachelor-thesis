package cz.cvut.fel.bachelor_thesis.repository;

import cz.cvut.fel.bachelor_thesis.model.EmailTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailTemplateRepository extends JpaRepository<Long, EmailTemplate> {
}
