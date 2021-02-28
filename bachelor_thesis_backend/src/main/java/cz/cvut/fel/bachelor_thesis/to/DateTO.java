package cz.cvut.fel.bachelor_thesis.to;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class DateTO {

    private Integer day;

    private Integer month;

    private Integer year;

    private String semester;
}
