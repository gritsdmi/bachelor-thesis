package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Email;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserTO {

    private Integer personalNumber;

    private String name;

    private String emailAddress;

    private Boolean firstLogin;

    private List<Email> sendEmails;

    private String userName;

    private String password;


    public UserTO(final Integer personalNumber, final String name,
                  final String emailAddress, final Boolean firstLogin, final List<Email> sendEmails,
                  final String userName, final String password) {
        this.personalNumber = personalNumber;
        this.name = name;
        this.emailAddress = emailAddress;
        this.firstLogin = firstLogin;
        this.sendEmails = sendEmails;
        this.userName = userName;
        this.password = password;
    }

    public UserTO() {
    }
}
