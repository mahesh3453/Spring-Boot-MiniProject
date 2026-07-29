package com.nit.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.nit.dto.CourseRequestDto;
import com.nit.dto.CourseResponseDto;

@Service
public interface CourseService {
	
	CourseResponseDto createCourse(CourseRequestDto courseRequestDto);
	CourseResponseDto getCourseById(long id);
	List<CourseResponseDto> getAllCourses();
	CourseResponseDto updateCourse(long id,CourseRequestDto courseRequestDto);
	void deleteCourse(long id);
	
	CourseResponseDto getCourseByTitle(String title);
	List<CourseResponseDto> getCoursesByFeeRange(double minFee,double maxFee);
}
