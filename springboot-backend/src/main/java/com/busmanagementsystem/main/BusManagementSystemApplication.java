package com.busmanagementsystem.main;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan({"com"}) 
@EnableJpaRepositories(basePackages = "com.busmanagementsystem.repository")
@EntityScan({ "com.busmanagementsystem.entity" })

public class BusManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusManagementSystemApplication.class, args);
	}
}