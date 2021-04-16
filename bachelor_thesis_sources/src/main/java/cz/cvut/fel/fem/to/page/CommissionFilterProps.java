package cz.cvut.fel.fem.to.page;

import cz.cvut.fel.fem.model.FieldOfStudy;
import cz.cvut.fel.fem.model.enums.CommissionState;
import cz.cvut.fel.fem.model.enums.Degree;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
@AllArgsConstructor
public class CommissionFilterProps {

    private final Degree selectedDegree;
    private final FieldOfStudy selectedField;
    private final List<String> selectedDatesRange;
    private final CommissionState selectedState;

}
