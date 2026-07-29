package com.nit.dto;

import lombok.Data;

@Data
public class StudentResponseDto {
	
	private Long id;
    private String name;
    private String email;
    private Integer age;
    private String city;
}
