# 🎓 Spring Boot Mini Project - Student & Course Enrollment Management

A robust, enterprise-ready **Spring Boot RESTful application** for managing **Students**, **Courses**, and **Enrollments**. Built with **Java 21**, **Spring Data JPA**, **Hibernate**, **MySQL**, and **Lombok**.

---

## 🚀 Features

- 👨‍🎓 **Student Management**: Register, update, and manage student details.
- 📚 **Course Management**: Create and structure courses with pricing, duration, and descriptions.
- 📝 **Enrollment System**: Enroll students into specific courses with date tracking and grade tracking.
- 🛡️ **Data Validation & Exception Handling**: Centralized exception management with standard response DTOs and validation constraints.
- 🗄️ **Relational Database Design**: Clean `@OneToMany` and `@ManyToOne` entity mappings with unique constraints for enrollments.

---

## 🛠️ Tech Stack & Prerequisites

- **Java**: JDK 21+
- **Framework**: Spring Boot 3.x / 4.x
- **Database**: MySQL Server
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Apache Maven
- **Utilities**: Project Lombok, Spring Validation

---

## 📂 Project Structure

```text
SpringBoot_MiniProject-01/
├── src/
│   ├── main/
│   │   ├── java/com/nit/
│   │   │   ├── dto/                # Data Transfer Objects (Requests & Responses)
│   │   │   ├── entity/             # JPA Entities (Student, Course, Enrollment)
│   │   │   ├── exception/          # Global Exception Handling & Custom Exceptions
│   │   │   ├── repository/         # Spring Data JPA Repositories
│   │   │   ├── service/            # Service Layer Interfaces & Implementations
│   │   │   ├── ServletInitializer.java
│   │   │   └── SpringBootMiniProject01Application.java
│   │   └── resources/
│   │       └── application.properties # Database and App Configuration
│   └── test/                       # Unit & Integration Tests
├── pom.xml
└── README.md
```

---

## ⚙️ Configuration & Setup

### 1. Database Configuration
Create a MySQL database named `springboot_miniproject`:
```sql
CREATE DATABASE springboot_miniproject;
```

Update your database credentials in `src/main/resources/application.properties` if needed:
```properties
spring.application.name=SpringBoot_MiniProject-01
spring.datasource.url=jdbc:mysql://localhost:3306/springboot_miniproject
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
```

### 2. Build and Run

Using Maven Wrapper:
```bash
# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

---

## 🔄 Daily Workflow / Pushing Updates

To push your daily progress to GitHub, execute the following commands in your project directory:

```bash
# 1. Check status of changed files
git status

# 2. Stage changes
git add .

# 3. Commit with a meaningful message
git commit -m "feat: updated course management logic"

# 4. Push updates to GitHub
git push
```

---

## 📄 License
This project is for educational and learning purposes under Naresh IT (NIT) coursework.
