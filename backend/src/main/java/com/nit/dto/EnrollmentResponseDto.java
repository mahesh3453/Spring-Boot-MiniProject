package com.nit.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EnrollmentResponseDto {
	private Long enrollmentId;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseTitle;
    private LocalDate enrollmentDate;
    private String grade;
}
