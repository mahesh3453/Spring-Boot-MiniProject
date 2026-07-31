package com.nit.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.nit.entity.Course;
import com.nit.entity.Student;
import com.nit.entity.Enrollment;
import com.nit.repository.CourseRepository;
import com.nit.repository.StudentRepository;
import com.nit.repository.EnrollmentRepository;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public DataInitializer(StudentRepository studentRepository, 
                           CourseRepository courseRepository,
                           EnrollmentRepository enrollmentRepository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed default courses if course table is empty
        if (courseRepository.count() == 0) {
            Course c1 = new Course();
            c1.setTitle("Full Stack Java Spring Boot & Angular");
            c1.setDescription("Master enterprise microservices, Spring Data JPA, Security, REST API architecture and Angular standalone components.");
            c1.setFee(25000.0);
            c1.setDurationInWeeks(12);
            courseRepository.save(c1);

            Course c2 = new Course();
            c2.setTitle("Cloud Native Microservices Architecture");
            c2.setDescription("Build resilient distributed systems with Spring Cloud Gateway, Netflix Eureka, Docker & Kubernetes.");
            c2.setFee(45000.0);
            c2.setDurationInWeeks(16);
            courseRepository.save(c2);

            Course c3 = new Course();
            c3.setTitle("Data Structures & Algorithms in Java");
            c3.setDescription("Deep dive into memory management, tree structures, dynamic programming, and algorithm optimization.");
            c3.setFee(15000.0);
            c3.setDurationInWeeks(10);
            courseRepository.save(c3);

            Course c4 = new Course();
            c4.setTitle("DevOps & CI/CD Pipeline Automation");
            c4.setDescription("Automate build & release workflows using GitHub Actions, Jenkins, Terraform, and AWS Cloud Infrastructure.");
            c4.setFee(35000.0);
            c4.setDurationInWeeks(14);
            courseRepository.save(c4);
        }

        // Seed default students if student table is empty
        if (studentRepository.count() == 0) {
            Student s1 = new Student();
            s1.setName("Rahul Sharma");
            s1.setEmail("rahul.s@gmail.com");
            s1.setAge(22);
            s1.setCity("Hyderabad");
            s1.setPassword("pass123");
            studentRepository.save(s1);

            Student s2 = new Student();
            s2.setName("Priya Verma");
            s2.setEmail("priya.v@gmail.com");
            s2.setAge(21);
            s2.setCity("Bangalore");
            s2.setPassword("pass123");
            studentRepository.save(s2);

            Student s3 = new Student();
            s3.setName("Anish Kumar");
            s3.setEmail("anish.k@gmail.com");
            s3.setAge(23);
            s3.setCity("Mumbai");
            s3.setPassword("pass123");
            studentRepository.save(s3);
        }

        // Seed initial enrollment if table is empty
        if (enrollmentRepository.count() == 0 && studentRepository.count() > 0 && courseRepository.count() > 0) {
            Student student = studentRepository.findAll().get(0);
            Course course = courseRepository.findAll().get(0);

            Enrollment enrollment = new Enrollment();
            enrollment.setStudent(student);
            enrollment.setCourse(course);
            enrollment.setEnrollmentDate(LocalDate.now());
            enrollment.setGrade("A+");
            enrollmentRepository.save(enrollment);
        }
    }
}
