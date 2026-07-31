package com.nit.dto;

import lombok.Data;

@Data
public class CourseResponseDto {
	private Long id;
    private String title;
    private String description;
    private double fee;
    private Integer durationInWeeks;
}
