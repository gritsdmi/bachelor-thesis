package cz.cvut.fel.fem.to;

import cz.cvut.fel.fem.model.User;
import cz.cvut.fel.fem.model.enums.EmailType;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class EmailTO {

    private User author;

    private List<User> to;

    private EmailType type;

    private String messageText;
}
