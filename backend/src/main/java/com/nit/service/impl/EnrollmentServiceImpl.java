package com.nit.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nit.dto.CourseResponseDto;
import com.nit.dto.EnrollmentRequestDto;
import com.nit.dto.EnrollmentResponseDto;
import com.nit.dto.StudentResponseDto;
import com.nit.entity.Course;
import com.nit.entity.Enrollment;
import com.nit.entity.Student;
import com.nit.exception.ResourseNotFoundException;
import com.nit.repository.CourseRepository;
import com.nit.repository.EnrollmentRepository;
import com.nit.repository.StudentRepository;
import com.nit.service.EnrollmentService;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

	private final EnrollmentRepository enrollmentRepository;
	
	private final StudentRepository studentRepository;
	
	private final CourseRepository courseRepository;

	EnrollmentServiceImpl(EnrollmentRepository enrollmentRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
		this.enrollmentRepository = enrollmentRepository;
		this.studentRepository = studentRepository;
		this.courseRepository = courseRepository;
	}
	
	@Override
	@Transactional
	public EnrollmentResponseDto enrollStudent(EnrollmentRequestDto enrollmentRequestDto) {
		Student student = studentRepository.findById(enrollmentRequestDto.getStudentId()).orElseThrow(
				() -> new ResourseNotFoundException("Student not found with Id: "+enrollmentRequestDto.getStudentId()));
		
		Course course = courseRepository.findById(enrollmentRequestDto.getCourseId()).orElseThrow(
				() -> new ResourseNotFoundException("Course not found with Id: "+enrollmentRequestDto.getCourseId()));
		
		if(enrollmentRepository.existsByStudentIdAndCourseId(enrollmentRequestDto.getStudentId(), enrollmentRequestDto.getCourseId())) {
			throw new IllegalArgumentException("Student is already enrolled in this course.");
		}
		
		Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setEnrollmentDate(LocalDate.now());
        enrollment.setGrade("ENROLLED");
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return mapToDto(savedEnrollment);
	}

	@Override
	@Transactional
	public void cancleEnrollment(long enrollmentId) {
		if(!enrollmentRepository.existsById(enrollmentId)) {
			throw new ResourseNotFoundException("Enrollment not found with Id: "+enrollmentId);
		}
		enrollmentRepository.deleteById(enrollmentId);
	}

	@Override
	@Transactional(readOnly = true)
	public List<EnrollmentResponseDto> getAllEnrollments() {
		return enrollmentRepository.findAll().
				stream().
				map(this::mapToDto).collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public List<CourseResponseDto> getCoursesByStudentId(long studentId) {
		if(!studentRepository.existsById(studentId)) {
			throw new ResourseNotFoundException("Student not found with Id: "+studentId);
		}
		List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
		
		return enrollments.
				stream().
				map(e -> mapCourseToDto(e.getCourse())).
				collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public List<StudentResponseDto> getStudentsByCourseId(long courseId) {
		if(!courseRepository.existsById(courseId)) {
			throw new ResourseNotFoundException("Course not found with Id: "+courseId);
		}
		List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
		
		return enrollments.stream().
				map(e -> mapStudentToDto(e.getStudent())).
				collect(Collectors.toList());
	}
	
	private EnrollmentResponseDto mapToDto(Enrollment entity) {
        EnrollmentResponseDto dto = new EnrollmentResponseDto();
        dto.setEnrollmentId(entity.getId());
        dto.setStudentId(entity.getStudent().getId());
        dto.setStudentName(entity.getStudent().getName());
        dto.setCourseId(entity.getCourse().getId());
        dto.setCourseTitle(entity.getCourse().getTitle());
        dto.setEnrollmentDate(entity.getEnrollmentDate());
        dto.setGrade(entity.getGrade());
        return dto;
    }
	
	private StudentResponseDto mapStudentToDto(Student entity) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setAge(entity.getAge());
        dto.setCity(entity.getCity());
        return dto;
    }
	
	private CourseResponseDto mapCourseToDto(Course entity) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setFee(entity.getFee());
        dto.setDurationInWeeks(entity.getDurationInWeeks());
        return dto;
    }

}
