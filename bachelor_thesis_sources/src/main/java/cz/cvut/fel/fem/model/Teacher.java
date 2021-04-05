package cz.cvut.fel.fem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.fem.model.enums.PositionEnum;
import cz.cvut.fel.fem.model.enums.TeacherDegree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Teacher")
//@PrimaryKeyJoinColumn(name = "userId")
public class Teacher extends AbstractEntity {

    private Integer personalNumber;

    private String name;

    private String surname;

    private String emailAddress;

    private String login;

    private String password;

    private Boolean firstLogin;

    @Enumerated(EnumType.STRING)
    private TeacherDegree degree;

    @ManyToMany(mappedBy = "teachers")
    @JsonIgnore
    @ToString.Exclude
    private List<Commission> commissionList;

    @ManyToMany(cascade = CascadeType.REMOVE)
//    @JsonIgnore
    private List<Date> unavailableDates;

    //uvazek
    private Double contract;

    //position in commission
    //TODO make class instead of enum
    @Enumerated(EnumType.STRING)
    private PositionEnum position;

    //TODO rename this
    private String titul;

    private String department;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Teacher teacher = (Teacher) o;
        return Objects.equals(personalNumber, teacher.personalNumber)
                && Objects.equals(name, teacher.name)
                && Objects.equals(surname, teacher.surname)
                && Objects.equals(emailAddress, teacher.emailAddress)
                && Objects.equals(login, teacher.login)
                && Objects.equals(password, teacher.password)
                && Objects.equals(firstLogin, teacher.firstLogin)
                && degree == teacher.degree
                && Objects.equals(contract, teacher.contract)
                && position == teacher.position
                && Objects.equals(titul, teacher.titul)
                && Objects.equals(department, teacher.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(personalNumber, name, surname, emailAddress, login,
                password, firstLogin, degree, contract, position, titul, department);
    }
}
