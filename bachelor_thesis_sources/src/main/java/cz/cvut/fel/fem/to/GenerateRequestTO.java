package cz.cvut.fel.fem.to;

import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GenerateRequestTO {

    private String dateFrom;

    private String dateTo;

    private String semester;
}
