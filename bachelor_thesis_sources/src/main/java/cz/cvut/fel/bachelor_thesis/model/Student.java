package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

//TODO delete this
@Entity
@Getter
@Setter
@ToString
@Table(name = "Student")
@PrimaryKeyJoinColumn(name = "userId")
public class Student extends AbstractEntity {

    @ManyToOne
    private FieldOfStudy fieldOfStudy;

    @ManyToOne
    private Exam exam;
}
