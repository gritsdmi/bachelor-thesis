package cz.cvut.fel.bachelor_thesis.to;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.model.Email;
import cz.cvut.fel.bachelor_thesis.model.enums.PositionEnum;
import cz.cvut.fel.bachelor_thesis.model.enums.TeacherDegree;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class TeacherTO {

    private Integer personalNumber;

    private String name;

    private String emailAddress;

    private String login;

    private String password;

    private Boolean firstLogin;

    private TeacherDegree degree;

    private List<Commission> commissionList;

    private List<Date> unavailableDates;

    private List<Email> sendEmails;

    private Double contract;

    //position in commission
    private PositionEnum position;

    //TODO rename this
    private String titul;

    @JsonCreator
    public TeacherTO(@JsonProperty("personalNumber") Integer personalNumber,
                     @JsonProperty("name") String name,
                     @JsonProperty("emailAddress") String emailAddress,
                     @JsonProperty("login") String login,
                     @JsonProperty("password") String password,
                     @JsonProperty("firstLogin") Boolean firstLogin,
                     @JsonProperty("degree") TeacherDegree degree,
                     @JsonProperty("commissionList") List<Commission> commissionList,
                     @JsonProperty("unavailableDates") List<Date> unavailableDates,
                     @JsonProperty("sendEmails") List<Email> sendEmails,
                     @JsonProperty("contract") Double contract,
                     @JsonProperty("position") PositionEnum position,
                     @JsonProperty("titul") String titul
    ) {
        this.personalNumber = personalNumber;
        this.name = name;
        this.emailAddress = emailAddress;
        this.login = login;
        this.password = password;
        this.firstLogin = firstLogin;
        this.degree = degree;
        this.commissionList = commissionList;
        this.unavailableDates = unavailableDates;
        this.sendEmails = sendEmails;
        this.contract = contract;
        this.position = position;
        this.titul = titul;
    }

    public TeacherTO() {

    }
}
