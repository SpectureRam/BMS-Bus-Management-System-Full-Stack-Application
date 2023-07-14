package com.busmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.busmanagementsystem.entity.SignUp;

@Repository
public interface SignUpRepository extends JpaRepository<SignUp, Integer> {

}
