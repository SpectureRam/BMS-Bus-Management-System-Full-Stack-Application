package com.busmanagementsystem.controller;

import com.busmanagementsystem.entity.SignUp;
import com.busmanagementsystem.repository.SignUpRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("/login")
public class LoginController {

    private final SignUpRepository signUpRepository;

    @Autowired
    public LoginController(SignUpRepository signUpRepository) {
        this.signUpRepository = signUpRepository;
    }

    @GetMapping("/get")
    public Iterable<SignUp> getUsers() {
        return signUpRepository.findAll();
    }

    @PostMapping("/add")
    public SignUp addUser(@RequestBody SignUp signUp) {
        return signUpRepository.save(signUp);
    }
}
