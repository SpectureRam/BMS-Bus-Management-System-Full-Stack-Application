package com.busmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.busmanagementsystem.entity.Route;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
}
