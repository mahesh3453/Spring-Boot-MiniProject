package com.nit.controller;

import java.util.List;

import org.springframework.data.domain.Page;
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

import com.nit.dto.StudentRequestDto;
import com.nit.dto.StudentResponseDto;
import com.nit.service.impl.StudentServiceImpl;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:4200")
public class StudentController {
	
	private final StudentServiceImpl studentService;

	StudentController(StudentServiceImpl studentService) {
		this.studentService = studentService;
	}
	
	@PostMapping
	public ResponseEntity<StudentResponseDto> createStudent(@Valid @RequestBody StudentRequestDto studentRequestDto){
		StudentResponseDto createdStudent = studentService.createStudent(studentRequestDto);
		return new ResponseEntity<StudentResponseDto>(createdStudent,HttpStatus.CREATED);
	}
	
	@GetMapping
    public ResponseEntity<List<StudentResponseDto>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }
	
	@GetMapping("/{id}")
	public ResponseEntity<StudentResponseDto> getStudentById(@Valid @PathVariable Long id) {
		return ResponseEntity.ok(studentService.getStudentById(id));
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<StudentResponseDto> updateStudent(@PathVariable Long id,@Valid @RequestBody StudentRequestDto studentRequestDto){
		return ResponseEntity.ok(studentService.updateStudent(id, studentRequestDto));
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteStudent(@PathVariable Long id){
		studentService.deleteStudent(id);
		return ResponseEntity.ok("Student deleted successfully with ID: "+id);
	}
	
	@GetMapping("/search/email")
    public ResponseEntity<StudentResponseDto> getStudentByEmail(@Valid @RequestParam String email) {
        return ResponseEntity.ok(studentService.getStudentByMail(email));
    }
	
	@GetMapping("/search/city")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByCity(@Valid @RequestParam String city) {
        return ResponseEntity.ok(studentService.getStudentsByCity(city));
    }
	
	@GetMapping("/search/name")
    public ResponseEntity<List<StudentResponseDto>> searchStudentsByName(@Valid @RequestParam String keyword) {
        return ResponseEntity.ok(studentService.searchStudentsByName(keyword));
    }
	
	@GetMapping("/page")
    public ResponseEntity<Page<StudentResponseDto>> getStudentsPaged(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(studentService.getStudentsWithPaginationAndSorting(pageNo, pageSize, sortBy, sortDir));
    }
 	
}
