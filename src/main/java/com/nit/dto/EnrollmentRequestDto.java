package com.nit.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class EnrollmentRequestDto {
	@NotEmpty(message = "Student ID is required")
    private Long studentId;

    @NotEmpty(message = "Course ID is required")
    private Long courseId;
}
