package com.example.user_microservices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    @Autowired
    private UserProfileRepository repository;

    // POST /api/users/signup
    @PostMapping("/signup")
    public ResponseEntity<UserProfile> signup(@RequestBody UserProfile profile) {
        UserProfile saved = repository.save(profile);
        return ResponseEntity.ok(saved);
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getProfile(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET /api/users/recommend/{interest}
    @GetMapping("/recommend/{interest}")
    public List<UserProfile> recommendUsers(@PathVariable("interest") String interestPl) {
        return repository.findByInterestsPlContaining(interestPl);
    }

    // GET /api/users/exists?email=...
    @GetMapping("/exists")
    public Map<String, Object> checkEmailExists(@RequestParam String email) {
        boolean present = repository.existsByEmail(email);
        Map<String, Object> resp = new HashMap<>();
        resp.put("presentInDatabase", present);
        resp.put("msg", present ? "This email has already been used" : "This email has not already been used");
        return resp;
    }

    // GET http://localhost:8080/api/users
    @GetMapping
    public List<UserProfile> getAllProfiles() {
        return repository.findAll();
    }
}