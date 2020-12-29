package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
public abstract class User extends AbstractEntity {

    private Integer personalNumber;

    private String name;

    private String emailAddress;

    @OneToMany(mappedBy = "author")
    private List<Email> sendEmails;

}
