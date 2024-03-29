package cz.cvut.fel.fem.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "Date")
public class Date extends AbstractEntity {

    private String date;

    private String semester;
}
