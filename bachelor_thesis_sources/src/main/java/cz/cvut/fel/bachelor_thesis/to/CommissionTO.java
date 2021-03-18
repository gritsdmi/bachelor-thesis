package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CommissionTO {

    private List<Teacher> teachers;

    private ExamTO exam;

    private CommissionState state;
}
