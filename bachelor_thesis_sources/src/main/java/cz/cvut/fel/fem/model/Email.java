package cz.cvut.fel.fem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.fem.model.enums.EmailType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Email")
public class Email extends AbstractEntity {

    @ManyToOne
    //manager
    private User author;

    @OneToMany
    @JsonIgnore
    private List<User> to;

    @Enumerated(EnumType.STRING)
    private EmailType type;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String subject;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String messageText;

}
