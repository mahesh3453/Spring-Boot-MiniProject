package com.nit.service;

import java.util.List;

import com.nit.dto.CourseResponseDto;
import com.nit.dto.EnrollmentRequestDto;
import com.nit.dto.EnrollmentResponseDto;
import com.nit.dto.StudentResponseDto;

public interface EnrollmentService {
	
	EnrollmentResponseDto enrollStudent(EnrollmentRequestDto enrollmentRequestDto);
	void cancleEnrollment(long enrollmentId);
	
	List<EnrollmentResponseDto> getAllEnrollments();
	List<CourseResponseDto> getCoursesByStudentId(long studentId);
	List<StudentResponseDto> getStudentsByCourseId(long courseId);
}
