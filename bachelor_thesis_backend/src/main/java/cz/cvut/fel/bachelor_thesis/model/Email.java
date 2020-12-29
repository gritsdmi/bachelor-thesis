package cz.cvut.fel.bachelor_thesis.model;

import cz.cvut.fel.bachelor_thesis.model.enums.EmailType;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
public class Email extends AbstractEntity {

    @ManyToOne
    private User author;
//    private String author;

    @OneToMany
    private List<User> to;
//    private String to;

    private EmailType type;

    private String messageText;

}
