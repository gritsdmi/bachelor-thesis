package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Setter
@Getter
@ToString
@Table(name = "Location")
public class Location extends AbstractEntity {

    private String classroom;

    private String building;


}
