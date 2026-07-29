package com.nit.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import com.nit.dto.StudentRequestDto;
import com.nit.dto.StudentResponseDto;
import com.nit.entity.Student;
import com.nit.exception.ResourseNotFoundException;
import com.nit.repository.StudentRepository;
import com.nit.service.StudentService;

public class StudentServiceImpl implements StudentService{
	
	private final StudentRepository studentRepository;

	StudentServiceImpl(StudentRepository studentRepository) {
		this.studentRepository = studentRepository;
	}

	@Override
	@Transactional
	public StudentResponseDto createStudent(StudentRequestDto studentRequestDto) {
		if(studentRepository.existsByEmail(studentRequestDto.getEmail())) {
			throw new IllegalArgumentException("Student with eamil "+studentRequestDto.getEmail()+" is already present");
		}
		Student student = mapToEntity(studentRequestDto);
		Student savedStudent = studentRepository.save(student);
		return mapToDto(savedStudent);
	}

	@Override
	@Transactional(readOnly = true)
	public StudentResponseDto getStudentById(Long id) {
		Student student = studentRepository.findById(id).orElseThrow(
				()-> new ResourseNotFoundException("Student not found with "+id));
		return mapToDto(student);
	}

	@Override
    @Transactional(readOnly = true)
	public List<StudentResponseDto> getAllStudents() {
		return studentRepository.findAll().
				stream().
				map(this::mapToDto).
				collect(Collectors.toList());
	}

	@Override
	@Transactional
	public StudentResponseDto updateStudent(Long id, StudentRequestDto studentRequestDto) {
		Student existingStudent = studentRepository.findById(id).orElseThrow(
				() -> new IllegalArgumentException("Student not found with ID"+id));
		existingStudent.setName(studentRequestDto.getName());
		existingStudent.setAge(studentRequestDto.getAge());
		existingStudent.setCity(studentRequestDto.getCity());
		existingStudent.setEmail(studentRequestDto.getEmail());
		existingStudent.setPassword(studentRequestDto.getPassword());
		
		Student updatedStudent = studentRepository.save(existingStudent);
		return mapToDto(updatedStudent);
	}

	@Override
	@Transactional
	public void deleteStudent(long id) {
		if(!studentRepository.existsById(id)) {
			throw new ResourseNotFoundException("Student not found with ID: "+id);
		}
		studentRepository.deleteById(id);
	}
	
	@Override
	public StudentResponseDto getStudentByMail(String mail) {
		Student student = studentRepository.findByEmail(mail).orElseThrow(
				() -> new ResourseNotFoundException("Student not found with mail: "+mail));
		
		return mapToDto(student);
	}
	
	@Override
	@Transactional(readOnly = true)
	public List<StudentResponseDto> getStudentsByCity(String city) {
		return studentRepository.
				findByCityIgnoreCase(city).
				stream().map(this::mapToDto).collect(Collectors.toList());
	}

	@Override
	public List<StudentResponseDto> searchStudentsByName(String keyword) {
		return studentRepository.
				findByNameContainingIgnoreCase(keyword).
				stream().map(this::mapToDto).collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public long countAllStudents() {
		long count = studentRepository.count();
		return count;
	}

	@Override
	public Page<StudentResponseDto> getStudentsWithPaginationAndSorting(int pageNo, int pageSize, String sortBy,
			String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Student> studentPage = studentRepository.findAll(pageable);
        return studentPage.map(this::mapToDto);
	}
	
	private Student mapToEntity(StudentRequestDto dto) {
		Student student = new Student();
		student.setName(dto.getName());
		student.setEmail(dto.getEmail());
		student.setCity(dto.getCity());
		student.setAge(dto.getAge());
		student.setPassword(dto.getPassword());
		return student;
	}
	
	private StudentResponseDto mapToDto(Student entity) {
		StudentResponseDto studentResponseDto = new StudentResponseDto();
		studentResponseDto.setName(entity.getName());
		studentResponseDto.setId(entity.getId());
		studentResponseDto.setAge(entity.getAge());
		studentResponseDto.setEmail(entity.getEmail());
		studentResponseDto.setCity(entity.getCity());
		return studentResponseDto;
	}

}
