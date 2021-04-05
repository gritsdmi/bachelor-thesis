package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.User;
import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Id;
import java.util.List;

@Getter
@Setter
@ToString
public class CommissionTO {

    @Id
    private Long id;

    private List<User> teachers;

    private ExamTO exam;

    private CommissionState state;
}
