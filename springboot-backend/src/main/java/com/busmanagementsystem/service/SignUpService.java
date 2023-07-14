package com.busmanagementsystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.busmanagementsystem.entity.SignUp;
import com.busmanagementsystem.repository.SignUpRepository;

@Service
public class SignUpService {

    private final SignUpRepository signUpRepository;

    @Autowired
    public SignUpService(SignUpRepository signUpRepository) {
        this.signUpRepository = signUpRepository;
    }

    public SignUp createSignUp(SignUp signUp) {
        return signUpRepository.save(signUp);
    }

    public SignUp getSignUpById(int id) {
        return signUpRepository.findById(id).orElseThrow(() -> new RuntimeException("SignUp not found"));
    }

    public SignUp updateSignUp(int id, SignUp updatedSignUp) {
        SignUp signUp = signUpRepository.findById(id).orElseThrow(() -> new RuntimeException("SignUp not found"));
        signUp.setName(updatedSignUp.getName());
        signUp.setEmail(updatedSignUp.getEmail());
        signUp.setUsername(updatedSignUp.getUsername());
        signUp.setPassword(updatedSignUp.getPassword());
        return signUpRepository.save(signUp);
    }

    public void deleteSignUp(int id) {
        SignUp signUp = signUpRepository.findById(id).orElseThrow(() -> new RuntimeException("SignUp not found"));
        signUpRepository.delete(signUp);
    }
    public List<SignUp> getAllSignUps() {
        return signUpRepository.findAll();
    }

}
