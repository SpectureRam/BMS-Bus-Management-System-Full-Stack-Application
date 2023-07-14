package com.busmanagementsystem.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.busmanagementsystem.entity.SignUp;
import com.busmanagementsystem.service.SignUpService;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/signup")
public class SignUpController {

    private final SignUpService signUpService;

    @Autowired
    public SignUpController(SignUpService signUpService) {
        this.signUpService = signUpService;
    }

    @PostMapping
    public SignUp createSignUp(@RequestBody SignUp signUp) {
        return signUpService.createSignUp(signUp);
    }

    @GetMapping("/{id}")
    public SignUp getSignUpById(@PathVariable int id) {
        return signUpService.getSignUpById(id);
    }

    @GetMapping
    public List<SignUp> getAllSignUps() {
        return signUpService.getAllSignUps();
    }

    
    @PutMapping("/{id}")
    public SignUp updateSignUp(@PathVariable int id, @RequestBody SignUp signUp) {
        return signUpService.updateSignUp(id, signUp);
    }

    @DeleteMapping("/{id}")
    public void deleteSignUp(@PathVariable int id) {
        signUpService.deleteSignUp(id);
    }
}
