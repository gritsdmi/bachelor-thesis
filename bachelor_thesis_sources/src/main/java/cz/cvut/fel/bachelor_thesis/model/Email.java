package cz.cvut.fel.bachelor_thesis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.bachelor_thesis.model.enums.EmailType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Email")
public class Email extends AbstractEntity {

    @ManyToOne
    //manager
    private User author;

    @OneToMany
    @JsonIgnore
    private List<User> to;

    @Enumerated(EnumType.STRING)
    private EmailType type;

    private String subject;

    private String messageText;

}
