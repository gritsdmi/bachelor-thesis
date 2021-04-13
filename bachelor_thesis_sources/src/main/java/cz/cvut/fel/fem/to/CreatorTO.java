package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.model.enums.Degree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class CreatorTO {

    private String date;

    private String time;

    private Degree degree;

    private String field;

    private Long locationId;

    private List<User> teachers;
}
