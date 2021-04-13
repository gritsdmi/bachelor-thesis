package cz.cvut.fel.fem.repository;

import cz.cvut.fel.fem.model.EmailTemplate;
import cz.cvut.fel.fem.model.enums.EmailType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {

    @Query("select t from EmailTemplate t where(t.emailType = :type)")
    List<EmailTemplate> findEmailTemplateByEmailType(@Param("type") EmailType emailType);
}
