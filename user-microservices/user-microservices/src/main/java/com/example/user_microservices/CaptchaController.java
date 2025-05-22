package com.example.user_microservices;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@CrossOrigin(origins = "http://localhost:8090") // Allow requests from your frontend server
@RestController
@RequestMapping("/api")
public class CaptchaController {

    private final Random random = new Random();

    /**
     * Generate two random integers from 0 to 10 for CAPTCHA
     * GET /api/capcha
     */
    @GetMapping("/capcha")
    public Map<String, Integer> generateCaptcha() {
        int op1 = random.nextInt(11); // 0 to 10 inclusive
        int op2 = random.nextInt(11); // 0 to 10 inclusive

        Map<String, Integer> response = new HashMap<>();
        response.put("op1", op1);
        response.put("op2", op2);

        return response;
    }
}