package cz.cvut.fel.bachelor_thesis.TO;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.model.Email;
import cz.cvut.fel.bachelor_thesis.model.enums.TeacherDegree;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TeacherTO extends UserTO {

    private TeacherDegree degree;

    private List<Commission> commissionList;

    private List<Date> unavailableDates;

    public TeacherTO(final Integer personalNumber, final String name, final String emailAddress,
                     final Boolean firstLogin, final List<Email> sendEmails, final String userName,
                     final String password, final TeacherDegree degree, final List<Commission> commissionList,
                     final List<Date> unavailableDates) {
        super(personalNumber, name, emailAddress, firstLogin, sendEmails, userName, password);
        this.degree = degree;
        this.commissionList = commissionList;
        this.unavailableDates = unavailableDates;
    }

    public TeacherTO() {

    }
}
