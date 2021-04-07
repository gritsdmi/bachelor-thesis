package cz.cvut.fel.fem.model.auth;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NewPassTO {
    private Long id;
    private String password;
}
