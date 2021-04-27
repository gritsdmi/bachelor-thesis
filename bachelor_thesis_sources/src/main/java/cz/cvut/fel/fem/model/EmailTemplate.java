package cz.cvut.fel.fem.model;

import cz.cvut.fel.fem.model.enums.EmailType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@ToString
@Getter
@Setter
@Table(name = "email_template")
public class EmailTemplate extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    private EmailType emailType;

    @Column(columnDefinition = "text")
    private String text;

    @Column(columnDefinition = "text")
    private String subject;
}
