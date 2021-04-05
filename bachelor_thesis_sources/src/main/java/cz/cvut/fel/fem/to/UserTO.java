package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.Email;
import cz.cvut.fel.fem.model.ManagerProperty;
import cz.cvut.fel.fem.model.StudentProperty;
import cz.cvut.fel.fem.model.TeacherProperty;
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
