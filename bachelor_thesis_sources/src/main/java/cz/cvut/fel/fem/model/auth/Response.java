package cz.cvut.fel.fem.model.auth;

import cz.cvut.fel.fem.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class Response {

    private final String jwt;

    private final Long userId;

    private final String username;

    private final Role role;

    private final Boolean firstLogin;

}
