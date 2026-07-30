# 🎓 Spring Boot Mini Project - Student & Course Enrollment Management

A robust, enterprise-ready **Spring Boot RESTful application** for managing **Students**, **Courses**, and **Enrollments**. Built with **Java 21**, **Spring Data JPA**, **Hibernate**, **MySQL**, and **Lombok**.

---

## 🚀 Features

- 👨‍🎓 **Student Management**: Register, update, search (by email, city, keyword), and list student details.
- 📚 **Course Management**: Manage course catalogs, duration, description, and pricing structures.
- 📝 **Enrollment System**: Enroll students into specific courses with validation (prevention of duplicate enrollments), date tracking, and grade tracking.
- 🛡️ **Improved Data Validation & Global Exception Handling**: Centralized exception management returning structured JSON error details for resource-not-found, illegal arguments, and field-level validation errors.
- 💾 **Transactional Safety**: Service implementations leverage Spring's declarative `@Transactional` management to guarantee data integrity.
- 🗄️ **Relational Database Design**: Clean `@OneToMany` and `@ManyToOne` entity mappings with automatic metadata generation (e.g., automated creation timestamp hooks).

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
│   │   │   ├── controller/         # REST Controllers (StudentController)
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

## 🔌 API Endpoints (Student Management)

The application exposes the following REST endpoints for **Student Management** under `/api/students`:

| Method | Endpoint | Description |
|---|---|---|
| **POST** | `/api/students` | Register/Create a new student |
| **GET** | `/api/students` | Retrieve all students |
| **GET** | `/api/students/{id}` | Get student by ID |
| **PUT** | `/api/students/{id}` | Update student details by ID |
| **DELETE** | `/api/students/{id}` | Delete a student by ID |
| **GET** | `/api/students/search/email?email=...` | Find student by unique email |
| **GET** | `/api/students/search/city?city=...` | Find students located in a specific city |
| **GET** | `/api/students/search/name?keyword=...` | Search students by name matching a keyword |
| **GET** | `/api/students/page?pageNo=0&pageSize=10` | Retrieve students with pagination and sorting support |

---

## 🔄 Daily Workflow / Pushing Updates

To push your progress to GitHub, execute the following commands in your project directory:

```bash
# 1. Stage changes
git add .

# 2. Commit with a meaningful message
git commit -m "feat: implement Student API endpoints and Enrollment service layer"

# 3. Push updates to GitHub
git push
```

---

## 📄 License
This project is for educational and learning purposes under Naresh IT (NIT) coursework.
