package com.nit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nit.entity.Course;

public interface CourseRepository extends JpaRepository<Course, Long> {
	
	Optional<Course> findByTitle(String title);
	
	List<Course> findByFeeBetween(double minFee, double maxFee);

}
