package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.Student;
import cz.cvut.fel.fem.model.enums.Degree;
import cz.cvut.fel.fem.model.enums.FieldOfStudyEnum;
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
