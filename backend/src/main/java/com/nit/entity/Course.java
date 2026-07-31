package com.nit.entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "course")
@Data
public class Course {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(nullable = false, unique = true)
	private String title;
	private String description;
	
	@Column(nullable = false)
	private Double fee;
	
	private Integer durationInWeeks;
	
	@Column(updatable = false)
	private LocalDateTime createdAt;
	
	@OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
	private List<Enrollment> enrollments;
	
	@PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
