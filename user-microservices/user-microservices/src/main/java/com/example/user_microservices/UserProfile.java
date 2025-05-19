package com.example.user_microservices;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String interestsPl;

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getInterestsPl() { return interestsPl; }

    public void setEmail(String email) { this.email = email; }
    public void setInterests(String interestsPl) { this.interestsPl = this.interestsPl; }
}