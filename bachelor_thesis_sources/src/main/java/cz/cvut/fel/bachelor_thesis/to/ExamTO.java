package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Location;
import cz.cvut.fel.bachelor_thesis.model.enums.Degree;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ExamTO {

    private Location location;

//    private Date date;
private String date;

    private String fieldOfStudy;

    private Degree degree;

}
