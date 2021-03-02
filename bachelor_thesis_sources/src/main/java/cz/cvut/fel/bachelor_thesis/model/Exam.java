package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Exam")
public class Exam extends AbstractEntity {

    @OneToOne
    private Commission commission;

    @ManyToOne
    private Location location;

    @ManyToOne
    private Date date;

    private String fieldOfStudy;

}
