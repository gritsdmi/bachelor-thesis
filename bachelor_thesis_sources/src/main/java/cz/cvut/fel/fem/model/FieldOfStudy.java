package cz.cvut.fel.fem.model;

import cz.cvut.fel.fem.model.enums.Degree;
import cz.cvut.fel.fem.model.enums.FieldOfStudyEnum;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Field_Of_Study")
public class FieldOfStudy extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "field", nullable = false)
    private FieldOfStudyEnum field;

    @Column(name = "deg", nullable = false)
    @Enumerated(EnumType.STRING)
    private Degree degree;

//    @OneToMany(mappedBy = "fieldOfStudy")
//    @JsonIgnore
//    private List<Student> studentList;
}
