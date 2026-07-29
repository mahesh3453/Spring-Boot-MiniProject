package com.nit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nit.entity.Enrollment;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
	List<Enrollment> findByStudentId(long id);
	
	List<Enrollment> findByCourseId(long id);
	
	boolean existsByStudentIdAndCourseId(long studentId,long courseId);
}
