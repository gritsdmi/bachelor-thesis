package cz.cvut.fel.bachelor_thesis.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@ToString
@Table(name = "Mananger")
@PrimaryKeyJoinColumn(name = "userId")
public class Manager extends User {

    private Boolean isAdmin;
}
