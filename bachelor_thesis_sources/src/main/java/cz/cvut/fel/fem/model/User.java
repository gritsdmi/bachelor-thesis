package cz.cvut.fel.fem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.fem.model.enums.Role;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@ToString
@Table(name = "users")
//@Inheritance(strategy = InheritanceType.JOINED)
public class User extends AbstractEntity {

    private Integer personalNumber;

    private String name;

    private String surname;

    private String emailAddress;

    private String login;

    private String password;

    private Boolean firstLogin;

    private String titlesPost; //vedecky titul

    private String titlesPre; //akademicky titul

    @OneToOne(cascade = CascadeType.ALL) // produce InvalidDataAccessApiUsageException
//    @OneToOne // w/o cascading produce TransientPropertyValueException
    @JoinColumn(name = "teacher", referencedColumnName = "id")
//    @Column(name = "teacher") // not allowed here
    private TeacherProperty teacher;

    @OneToOne
    private StudentProperty student;

    @OneToOne
    private ManagerProperty manager;

    @OneToMany(mappedBy = "author")
    @JsonIgnore
    private List<Email> sendEmails;

    @Enumerated(EnumType.STRING)
    private Role role;

    public String getFullName() {

        var sb = new StringBuilder();
        if (this.titlesPre != null && !this.titlesPre.equals(""))
            sb.append(this.titlesPre).append(" ");
        sb.append(this.name).append(" ");
        sb.append(this.surname);
        if (this.titlesPost != null && !this.titlesPost.equals(""))
            sb.append(" ").append(this.titlesPre);

        return sb.toString();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(personalNumber, user.personalNumber)
                && Objects.equals(name, user.name)
                && Objects.equals(surname, user.surname)
                && Objects.equals(emailAddress, user.emailAddress)
                && Objects.equals(login, user.login)
                && Objects.equals(password, user.password)
                && Objects.equals(titlesPost, user.titlesPost)
                && Objects.equals(titlesPre, user.titlesPre);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }
}
