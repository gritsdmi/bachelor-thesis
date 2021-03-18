package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CreatorTO {

    private String date;

    private Degree degree;

    private Long locationId;

    private List<Teacher> teachers;
}
