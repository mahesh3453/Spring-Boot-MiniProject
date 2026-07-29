package com.nit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nit.entity.Student;

public interface StudentRepository extends JpaRepository<Student, Long> {
	
	Optional<Student> findByEmail(String email);
	
	List<Student> findByCityIgnoreCase(String city);
	
	List<Student> findByNameContainingIgnoreCase(String name);
	
	boolean existsByEmail(String email);
}
