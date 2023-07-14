package com.busmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.busmanagementsystem.entity.Driver;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
}
