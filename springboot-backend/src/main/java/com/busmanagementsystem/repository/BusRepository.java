package com.busmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.busmanagementsystem.entity.Bus;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
}
