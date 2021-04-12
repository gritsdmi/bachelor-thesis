package cz.cvut.fel.fem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.fem.model.enums.Degree;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Exam")
public class Exam extends AbstractEntity {

    @OneToOne(mappedBy = "exam")// w/o mapped was OK
    @JsonIgnore
    @ToString.Exclude
    private Commission commission;

    @ManyToOne
//    @JsonIgnore
    private Location location;

    private String time;

    private String date;

    private String semester;

    private String fieldOfStudy;

    //todo replace this by Field of study @ManyToOne
    @Enumerated(EnumType.STRING)
    private Degree degree;

    @OneToMany
//            (mappedBy = "exam")
    private List<User> students;

}
