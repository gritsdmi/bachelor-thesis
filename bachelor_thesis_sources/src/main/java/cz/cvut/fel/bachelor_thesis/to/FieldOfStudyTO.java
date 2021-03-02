package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Student;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import cz.cvut.fel.bachelor_thesis.model.enums.FieldOfStudyEnum;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class FieldOfStudyTO {

    private FieldOfStudyEnum field;

    private Degree degree;

    private List<Student> studentList;
}
