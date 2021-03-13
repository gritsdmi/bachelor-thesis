package cz.cvut.fel.bachelor_thesis.to;

import cz.cvut.fel.bachelor_thesis.model.Manager;
import cz.cvut.fel.bachelor_thesis.model.Teacher;
import cz.cvut.fel.bachelor_thesis.model.enums.EmailType;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class EmailTO {

    private Manager author;

    private List<Teacher> to;

    private EmailType type;

    private String messageText;
}
