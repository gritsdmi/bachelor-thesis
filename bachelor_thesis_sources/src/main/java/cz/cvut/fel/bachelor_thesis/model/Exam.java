package cz.cvut.fel.bachelor_thesis.model;

import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

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

    @Enumerated(EnumType.STRING)
    private Degree degree;
}
