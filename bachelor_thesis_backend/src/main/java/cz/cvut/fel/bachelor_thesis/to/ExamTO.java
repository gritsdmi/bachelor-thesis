package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Commission;
import cz.cvut.fel.bachelor_thesis.model.Date;
import cz.cvut.fel.bachelor_thesis.model.Location;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class ExamTO {

    private Commission commission;

    private Location location;

    private Date date;

    private String fieldOfStudy;
}
