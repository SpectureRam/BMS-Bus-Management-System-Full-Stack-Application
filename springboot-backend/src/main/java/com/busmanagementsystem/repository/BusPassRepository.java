package com.busmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.busmanagementsystem.entity.BusPass;

@Repository
public interface BusPassRepository extends JpaRepository<BusPass, Long> {
}
