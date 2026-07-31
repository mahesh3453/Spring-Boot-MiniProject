package com.nit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StudentRequestDto {
	
	@NotBlank(message = "Name is required")
	private String name;
	
	@NotBlank(message = "Email is required")
	private String email;
	private int age;
	
	@NotBlank(message = "City is required")
	private String city;
	
	@NotBlank(message = "Password is required")
	private String password;
	
}
