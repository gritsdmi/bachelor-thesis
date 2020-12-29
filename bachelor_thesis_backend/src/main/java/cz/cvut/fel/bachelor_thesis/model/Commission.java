package cz.cvut.fel.bachelor_thesis.model;

import cz.cvut.fel.bachelor_thesis.model.enums.CommissionState;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.OneToOne;
import java.util.List;

@Entity
@Getter
@Setter
public class Commission extends AbstractEntity {

    //ownerSide
    @ManyToMany
    private List<Teacher> teachers;

    @OneToOne
    private Exam exam;

    private CommissionState state;
}
