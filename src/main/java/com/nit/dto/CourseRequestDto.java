package com.nit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class CourseRequestDto {
	
	@NotBlank(message = "Course title is required")
	private String title;
	
	private String description;
	
	@NotEmpty(message = "Fee is required")
	private double fee;
	
	@NotEmpty(message = "Duration is required")
	private int durationInWeeks;
	
}
