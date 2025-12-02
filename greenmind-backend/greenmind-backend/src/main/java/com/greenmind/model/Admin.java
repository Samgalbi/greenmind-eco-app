package com.greenmind.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Admin user entity
 */
@Entity
@DiscriminatorValue("ADMIN")
@Data
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {

    public Admin() {
        setRole("ADMIN");
    }
}
