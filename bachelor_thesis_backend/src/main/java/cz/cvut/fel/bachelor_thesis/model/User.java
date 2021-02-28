package cz.cvut.fel.bachelor_thesis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User extends AbstractEntity {

    private Integer personalNumber;

    private String name;

    private String emailAddress;

    private String login;

    private String password;

    private Boolean firstLogin;

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Email> sendEmails;

}
