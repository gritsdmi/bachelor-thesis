package cz.cvut.fel.bachelor_thesis.model;

import cz.cvut.fel.bachelor_thesis.model.enums.EmailType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@ToString
@Getter
@Setter
@Table(name = "email_template")
public class EmailTemplate extends AbstractEntity {

    private EmailType emailType;

    private String text;

    private String subject;
}
