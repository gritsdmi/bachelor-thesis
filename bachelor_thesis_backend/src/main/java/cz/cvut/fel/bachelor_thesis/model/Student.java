package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "userId")
public class Student extends User {

    @ManyToOne
    private FieldOfStudy fieldOfStudy;
}
