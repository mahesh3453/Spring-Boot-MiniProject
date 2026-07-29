package com.nit.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nit.dto.CourseRequestDto;
import com.nit.dto.CourseResponseDto;
import com.nit.entity.Course;
import com.nit.exception.ResourseNotFoundException;
import com.nit.repository.CourseRepository;
import com.nit.service.CourseService;

@Service
public class CourseServiceImpl implements CourseService{

	private final CourseRepository courseRepository;

	CourseServiceImpl(CourseRepository courseRepository) {
		this.courseRepository = courseRepository;
	}
	
	@Override
	public CourseResponseDto createCourse(CourseRequestDto courseRequestDto) {
		Course course = mapToEntity(courseRequestDto);
		Course savedCourse = courseRepository.save(course);
		return mapToDto(savedCourse);
	}

	@Override
	public CourseResponseDto getCourseById(long id) {
		Course course = courseRepository.findById(id).orElseThrow(
				() -> new ResourseNotFoundException("Course not found with Id: "+id));
		return mapToDto(course);
	}

	@Override
	public List<CourseResponseDto> getAllCourses() {
		return courseRepository.findAll().stream().
				map(this::mapToDto).
				collect(Collectors.toList());
	}

	@Override
	public CourseResponseDto updateCourse(long id, CourseRequestDto courseRequestDto) {
		Course course = courseRepository.findById(id).orElseThrow(
				() -> new ResourseNotFoundException("Course not found with Id: "+id));
		course.setCourseTitle(courseRequestDto.getTitle());
		course.setDescription(courseRequestDto.getDescription());
		course.setFee(courseRequestDto.getFee());
		course.setDurationInWeeks(courseRequestDto.getDurationInWeeks());
		
		Course updatedCourse = courseRepository.save(course);
		return mapToDto(updatedCourse);
	}

	@Override
	public void deleteCourse(long id) {
		if(!courseRepository.existsById(id)) {
			throw new ResourseNotFoundException("Course not found with Id: "+id);
		}
		courseRepository.deleteById(id);
	}

	@Override
	@Transactional(readOnly = true)
	public CourseResponseDto getCourseByTitle(String title) {
		Course course = courseRepository.findByTitle(title).orElseThrow(
				() -> new ResourseNotFoundException("Course not found with title: "+title));
		return mapToDto(course);
	}

	@Override
	@Transactional(readOnly = true)
	public List<CourseResponseDto> getCoursesByFeeRange(double minFee, double maxFee) {
		return courseRepository.findByFeeBetween(minFee, maxFee).
				stream().map(this::mapToDto).collect(Collectors.toList());
	}
	
	private Course mapToEntity(CourseRequestDto courseRequestDto) {
		Course course = new Course();
		course.setCourseTitle(courseRequestDto.getTitle());
		course.setDescription(courseRequestDto.getDescription());
		course.setDurationInWeeks(courseRequestDto.getDurationInWeeks());
		course.setFee(courseRequestDto.getFee());
		return course;
	}
	
	private CourseResponseDto mapToDto(Course entity) {
		CourseResponseDto dto = new CourseResponseDto();
		dto.setDescription(entity.getDescription());
		dto.setDurationInWeeks(entity.getDurationInWeeks());
		dto.setFee(entity.getFee());
		dto.setTitle(entity.getCourseTitle());
		dto.setId(entity.getCourseId());
		return dto;
	}

}
