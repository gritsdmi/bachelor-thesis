package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.Location;
import cz.cvut.fel.fem.model.enums.Degree;
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
