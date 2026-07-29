package com.nit.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import com.nit.dto.StudentRequestDto;
import com.nit.dto.StudentResponseDto;

@Service
public interface StudentService {
	
	StudentResponseDto createStudent(StudentRequestDto studentRequestDto);
	StudentResponseDto getStudentById(Long id);
	List<StudentResponseDto> getAllStudents();
	StudentResponseDto updateStudent(Long id,StudentRequestDto studentRequestDto);
	void deleteStudent(long id);
	
	List<StudentResponseDto> getStudentsByCity(String city);
	StudentResponseDto getStudentByMail(String mail);
	List<StudentResponseDto> searchStudentsByName(String keyword);
	
	long countAllStudents();
	
	Page<StudentResponseDto> getStudentsWithPaginationAndSorting(int pageNo, int pageSize, String sortBy, String sortDir);
}
