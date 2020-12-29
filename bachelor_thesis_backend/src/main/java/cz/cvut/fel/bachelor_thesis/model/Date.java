package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity
@Getter
@Setter
public class Date extends AbstractEntity {

    private Integer day;
    private Integer month;
    private Integer year;
    private String semester;
}
