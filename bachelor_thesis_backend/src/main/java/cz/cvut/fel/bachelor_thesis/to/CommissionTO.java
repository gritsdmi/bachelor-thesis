package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Exam;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class CommissionTO {

    private List<Teacher> teachers;

    private Exam exam;

    private CommissionState state;
}
