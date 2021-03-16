package cz.cvut.fel.bachelor_thesis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Exam")
public class Exam extends AbstractEntity {

    @OneToOne
    private Commission commission;

    @ManyToOne
    @JsonIgnore
    private Location location;

    @ManyToOne(cascade = CascadeType.REMOVE)
    private Date date;

    private String semester;

    private String fieldOfStudy;

    @Enumerated(EnumType.STRING)
    private Degree degree;

    @OneToMany(mappedBy = "exam")
    private List<Student> students;
}
