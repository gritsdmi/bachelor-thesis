package cz.cvut.fel.bachelor_thesis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import cz.cvut.fel.bachelor_thesis.model.enums.FieldOfStudyEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "FieldOfStudy")
public class FieldOfStudy extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "field", nullable = false)
    private FieldOfStudyEnum field;

    @Column(name = "deg", nullable = false)
    @Enumerated(EnumType.STRING)
    private Degree degree;

    @OneToMany(mappedBy = "fieldOfStudy")
    @JsonIgnore
    private List<Student> studentList;
}
