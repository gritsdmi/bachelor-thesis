package cz.cvut.fel.fem.model;

import cz.cvut.fel.fem.model.enums.EmailType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

@Entity
@ToString
@Getter
@Setter
@Table(name = "email_template")
public class EmailTemplate extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    private EmailType emailType;

    private String text;

    private String subject;
}
