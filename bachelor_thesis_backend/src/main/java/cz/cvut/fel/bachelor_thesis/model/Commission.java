package cz.cvut.fel.bachelor_thesis.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Commission")
public class Commission extends AbstractEntity {

    //ownerSide
    @ManyToMany
    @JsonIgnore
    private List<Teacher> teachers;

    @OneToOne
    private Exam exam;

    @Enumerated(EnumType.STRING)
    private CommissionState state;
}
