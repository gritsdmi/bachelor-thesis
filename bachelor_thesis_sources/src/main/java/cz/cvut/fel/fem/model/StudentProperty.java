package cz.cvut.fel.fem.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
public class StudentProperty extends AbstractEntity {

    @ManyToOne
    private FieldOfStudy fieldOfStudy;

    @ManyToMany
    private List<Exam> exams;
}
