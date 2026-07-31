package com.nit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nit.dto.CourseResponseDto;
import com.nit.dto.EnrollmentRequestDto;
import com.nit.dto.EnrollmentResponseDto;
import com.nit.dto.StudentResponseDto;
import com.nit.service.EnrollmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:4200")
public class EnrollmentController {

	private final EnrollmentService enrollmentService;

	EnrollmentController(EnrollmentService enrollmentService) {
		this.enrollmentService = enrollmentService;
	}
	
	@PostMapping
	public ResponseEntity<EnrollmentResponseDto> enrollStudent(@Valid @RequestBody EnrollmentRequestDto enrollmentRequestDto){
		EnrollmentResponseDto response = enrollmentService.enrollStudent(enrollmentRequestDto);
		return new ResponseEntity<EnrollmentResponseDto>(response,HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<EnrollmentResponseDto>> getAllEnrollments(){
		return ResponseEntity.ok(enrollmentService.getAllEnrollments());
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> cancelEnrollment(@Valid @PathVariable Long id){
		enrollmentService.cancleEnrollment(id);
        return ResponseEntity.ok("Enrollment canceled successfully for ID: " + id);
	}
	
	@GetMapping("/student/{studentId}/courses")
    public ResponseEntity<List<CourseResponseDto>> getCoursesByStudentId(@PathVariable Long studentId) {
        return ResponseEntity.ok(enrollmentService.getCoursesByStudentId(studentId));
    }
	
	@GetMapping("/course/{courseId}/students")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getStudentsByCourseId(courseId));
    }
}
