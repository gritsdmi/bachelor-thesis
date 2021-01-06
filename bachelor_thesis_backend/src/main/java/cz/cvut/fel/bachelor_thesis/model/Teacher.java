package cz.cvut.fel.bachelor_thesis.model;

import cz.cvut.fel.bachelor_thesis.model.enums.TeacherDegree;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import java.util.List;

@Entity
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "userId")
public class Teacher extends User {

    private TeacherDegree degree;

    @ManyToMany(mappedBy = "teachers")
    private List<Commission> commissionList;

    @ManyToMany
    private List<Date> unavailableDates;
}
