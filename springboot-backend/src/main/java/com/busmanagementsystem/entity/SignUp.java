package com.busmanagementsystem.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name="logincredentials",uniqueConstraints=@UniqueConstraint(columnNames= {"username"}))
public class SignUp {
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private int id;
  @Column(name = "name")
  private String name;
  @Column(name = "email",unique=true)
  private String email;
  @Column(name = "username",unique=true)
  private String username;
  @Column(name = "password")
  private String password;
  
  public int getId() {
    return id;
  }
  public void setId(int id) {
    this.id = id;
  }
  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
  }
  public String getEmail() {
    return email;
  }
  public void setEmail(String email) {
    this.email = email;
  }
public SignUp(int id, String name, String email, String username, String password) {
	super();
	this.id = id;
	this.name = name;
	this.email = email;
	this.username = username;
	this.password = password;
	}
	public SignUp() {
	}
  
}