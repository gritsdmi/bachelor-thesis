package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Email;
import cz.cvut.fel.bachelor_thesis.model.ManagerProperty;
import cz.cvut.fel.bachelor_thesis.model.StudentProperty;
import cz.cvut.fel.bachelor_thesis.model.TeacherProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Id;
import java.util.List;

/**
 * UserTO class looks exactly like User class
 */
@Getter
@Setter
@ToString
public class UserTO {

    @Id
    private Long id;

    private Integer personalNumber;

    private String name;

    private String surname;

    private String emailAddress;

    private String login;

    private String password;

    private Boolean firstLogin;

    private List<Email> sendEmails;

    private String titlesPost; //vedecky titul

    private String titlesPre; //akademicky titul

    private TeacherProperty teacher;

    private ManagerProperty manager;

    private StudentProperty student;

    public UserTO() {
    }
}
