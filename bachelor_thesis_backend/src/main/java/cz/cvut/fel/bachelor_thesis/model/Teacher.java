package cz.cvut.fel.bachelor_thesis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.bachelor_thesis.model.enums.PositionEnum;
import cz.cvut.fel.bachelor_thesis.model.enums.TeacherDegree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Teacher")
//@PrimaryKeyJoinColumn(name = "userId")
public class Teacher extends AbstractEntity {

    private Integer personalNumber;

    private String name;

    private String emailAddress;

    private String login;

    private String password;

    private Boolean firstLogin;

    @Enumerated(EnumType.STRING)
    private TeacherDegree degree;

    @ManyToMany(mappedBy = "teachers")
    @JsonIgnore
    private List<Commission> commissionList;

    @ManyToMany
    @JsonIgnore
    private List<Date> unavailableDates;

    //uvazek
    private Double contract;

    //position in commission
    @Enumerated(EnumType.STRING)
    private PositionEnum position;

    //TODO rename this
    private String titul;

}
