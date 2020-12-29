package cz.cvut.fel.bachelor_thesis.model;

import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import cz.cvut.fel.bachelor_thesis.model.enums.FieldOfStudyEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import java.util.List;

@Entity
@Getter
@Setter
public class FieldOfStudy extends AbstractEntity {

    private FieldOfStudyEnum field;

    private Degree degree;

    @OneToMany(mappedBy = "fieldOfStudy")
    private List<Student> studentList;
}
