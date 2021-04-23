package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.enums.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class NewUserTo {

    private Integer personalNumber;

    private String name;

    private String surname;

    private String emailAddress;

    private String titlesPost; //vedecky titul

    private String titlesPre; //akademicky titul

    private TeacherPropertyTO teacher;

    private ManagerPropertyTO manager;

    private Role role;

}
