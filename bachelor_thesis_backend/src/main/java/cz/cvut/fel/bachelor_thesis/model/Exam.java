package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Entity
@Getter
@Setter
public class Exam extends AbstractEntity {

    @OneToOne
    private Commission commission;

    @ManyToOne
    private Location location;

    @ManyToOne
    private Date date;

    private String fieldOfStudy;

}
