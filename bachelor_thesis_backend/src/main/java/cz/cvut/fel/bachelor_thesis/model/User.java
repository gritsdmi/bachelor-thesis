package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User extends AbstractEntity {

    private Integer personalNumber;

    private String name;

    private String emailAddress;

    private String userName;

    private String password;

    private Boolean firstLogin;

    @OneToMany(mappedBy = "author")
    private List<Email> sendEmails;

}
