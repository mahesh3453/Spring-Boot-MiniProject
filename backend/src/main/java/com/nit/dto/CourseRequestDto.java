package com.nit.dto;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CourseRequestDto {
	
	@NotBlank(message = "Course title is required")
	private String title;
	
	private String description;
	
	@Nonnull
	@Positive(message = "Fee must be greater than 0")
	private Double fee;
	
	@Nonnull
	@Positive(message = "Duration must be greater than 0")
	private Integer durationInWeeks;
	
}
