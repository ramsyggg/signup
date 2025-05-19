package com.example.user_microservices;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    List<UserProfile> findByInterestsPlContaining(String interestPl);
    boolean existsByEmail(String email);
}
