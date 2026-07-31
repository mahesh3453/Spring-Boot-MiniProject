package com.nit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nit.dto.CourseRequestDto;
import com.nit.dto.CourseResponseDto;
import com.nit.service.impl.CourseServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:4200")
public class CourseController {
	
	private final CourseServiceImpl courseService;

	CourseController(CourseServiceImpl courseService) {
		this.courseService = courseService;
	}
	
	@PostMapping
	public ResponseEntity<CourseResponseDto> createCourse(@Valid @RequestBody CourseRequestDto courseRequestDto){
		CourseResponseDto createdCourse = courseService.createCourse(courseRequestDto);
		return new ResponseEntity<>(createdCourse,HttpStatus.CREATED);
	}
	
	@GetMapping
	public ResponseEntity<List<CourseResponseDto>> getAllCourses(){
		return ResponseEntity.ok(courseService.getAllCourses());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<CourseResponseDto> getCourseById(@Valid @PathVariable Long id){
		return ResponseEntity.ok(courseService.getCourseById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<CourseResponseDto> updateCourse(@PathVariable Long id,
			@Valid @RequestBody CourseRequestDto courseRequestDto){
		return ResponseEntity.ok(courseService.updateCourse(id, courseRequestDto));
	}
	
	@DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok("Course deleted successfully with ID: " + id);
    }
	
	@GetMapping("/search")
    public ResponseEntity<CourseResponseDto> getCourseByTitle(@RequestParam String title) {
        return ResponseEntity.ok(courseService.getCourseByTitle(title));
    }

    @GetMapping("/fee-range")
    public ResponseEntity<List<CourseResponseDto>> getCoursesByFeeRange(@RequestParam Double minFee, 
                                                                         @RequestParam Double maxFee) {
        return ResponseEntity.ok(courseService.getCoursesByFeeRange(minFee, maxFee));
    }
}
