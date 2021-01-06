package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
@Getter
@Setter
@PrimaryKeyJoinColumn(name = "userId")
public class Manager extends User {

    private Boolean isAdmin;
}
