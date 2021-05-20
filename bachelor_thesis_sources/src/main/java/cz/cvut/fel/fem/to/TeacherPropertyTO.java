package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.Date;
import cz.cvut.fel.fem.model.FieldOfStudy;
import cz.cvut.fel.fem.model.Position;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class TeacherPropertyTO {

    private Double contract;

    private String department;

    private List<Date> unavailableDates;

    private List<FieldOfStudy> preferredFieldOfStudies;

    private List<Position> positionInCommissions;

    private String approvedByScientificCouncilFrom;

    private List<String> degrees;

    private String commissionTypes;

    private Boolean extern;


}
