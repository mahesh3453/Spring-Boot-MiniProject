package com.nit.dto;

import jakarta.annotation.Nonnull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class EnrollmentRequestDto {
	
	@Nonnull
	@Positive(message = "Student id is invalid")
    private Long studentId;

	@Nonnull
	@Positive(message = "Course id is invalid")
    private Long courseId;
}
