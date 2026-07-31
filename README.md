# 🎓 Full-Stack Student & Course Enrollment Management System

A modern, enterprise-ready full-stack application built with a **Spring Boot RESTful Backend** and an **Angular 19 Reactive Dashboard Frontend**. Manage **Students**, **Courses**, and **Enrollments** seamlessly with real-time statistics, advanced search/filtering, interactive analytics, and full dark mode support.

---

## 🚀 Key Features

- 👨‍🎓 **Student Management**: Full CRUD operations, search by email/city/name, and server-side paginated data views.
- 📚 **Course Catalog**: Manage course descriptions, duration, pricing structures, and fee range queries.
- 📝 **Enrollment System**: Enroll students into courses with validation against duplicate enrollments, date tracking, and cancellation support.
- 📊 **Interactive Analytics**: Dashboard metrics, enrollment growth charts, and breakdown summaries using **ApexCharts**.
- 🎨 **Modern Design & UX**: Sleek glassmorphism dashboard UI powered by **Tailwind CSS**, **Lucide Icons**, and **Angular Material**.
- 🌓 **Dark & Light Mode**: Built-in theme switcher with state persistence.
- 🛡️ **Robust Validation & Exception Handling**: Centralized Spring `@ControllerAdvice` returning structured error payloads.
- ⚡ **Auto Data Seeding**: Pre-configured `DataInitializer` seeds test courses and sample student data automatically on start.

---

## 🛠️ Tech Stack

### **Backend Service**
- **Java**: JDK 21+
- **Framework**: Spring Boot 3.x / 4.x
- **Database**: MySQL Server
- **ORM & Persistence**: Spring Data JPA / Hibernate
- **Build Tool**: Apache Maven
- **Utilities**: Project Lombok, Spring Validation

### **Frontend Application**
- **Framework**: Angular 19 (Standalone Components, Reactive Signals)
- **Styling**: Tailwind CSS & Sass
- **UI Components**: Angular Material & Lucide Angular
- **Charts & Toast Notifications**: ApexCharts & ngx-toastr
- **Build Tool**: Angular CLI / Vite engine

---

## 📂 Project Structure

```text
SpringBoot_MiniProject-01/
├── backend/                       # Spring Boot REST API Application
│   ├── src/main/java/com/nit/
│   │   ├── config/                # Web CORS & Data Seeding Initializers
│   │   ├── controller/            # REST Controllers (Student, Course, Enrollment)
│   │   ├── dto/                   # Request & Response Data Transfer Objects
│   │   ├── entity/                # JPA Database Entities
│   │   ├── exception/             # Custom Exceptions & Global Exception Handler
│   │   ├── repository/            # Spring Data Repositories
│   │   └── service/               # Business Logic Interfaces & Implementations
│   ├── src/main/resources/
│   │   └── application.properties # Database Connection & Spring Config
│   ├── pom.xml                    # Maven Dependencies Configuration
│   └── mvnw / mvnw.cmd            # Maven Wrapper Executables
│
├── frontend/                      # Angular 19 SPA Application
│   ├── src/app/
│   │   ├── core/                  # Services, Models, Guards & Interceptors
│   │   ├── layouts/               # Dashboard Layout & Sidebar Components
│   │   ├── pages/                 # Dashboard, Students, Courses, Analytics
│   │   └── shared/                # Reusable UI Elements (Cards, Dialogs, Loaders)
│   ├── angular.json               # Angular CLI Workspace Config
│   └── package.json               # Node.js Project Dependencies
│
└── README.md
```

---

## ⚙️ Quick Start & Setup Guide

### 1. Database Setup
Create a MySQL database named `springboot_miniproject`:
```sql
CREATE DATABASE springboot_miniproject;
```

Update your database credentials in `backend/src/main/resources/application.properties` if needed:
```properties
spring.application.name=SpringBoot_MiniProject-01
spring.datasource.url=jdbc:mysql://localhost:3306/springboot_miniproject
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
```

### 2. Start Backend Service
Navigate to the `backend` directory and run using Maven Wrapper:

```bash
# Windows
cd backend
.\mvnw.cmd spring-boot:run

# Linux / macOS
cd backend
./mvnw spring-boot:run
```
*Backend runs on:* `http://localhost:8080`

### 3. Start Frontend Application
Navigate to the `frontend` directory, install dependencies, and launch dev server:

```bash
cd frontend
npm install
npm start
```
*Frontend runs on:* `http://localhost:4200`

---

## 🔌 REST API Reference

### **Student Endpoints (`/api/students`)**
| Method | Endpoint | Description |
|---|---|---|
| **POST** | `/api/students` | Register/Create a new student |
| **GET** | `/api/students` | Retrieve all students |
| **GET** | `/api/students/{id}` | Get student by ID |
| **PUT** | `/api/students/{id}` | Update student details by ID |
| **DELETE** | `/api/students/{id}` | Delete a student by ID |
| **GET** | `/api/students/search/email?email=...` | Find student by unique email |
| **GET** | `/api/students/search/city?city=...` | Find students by city |
| **GET** | `/api/students/search/name?keyword=...` | Search students by name |
| **GET** | `/api/students/page?pageNo=0&pageSize=10` | Server-side paginated students view |

### **Course Endpoints (`/api/courses`)**
| Method | Endpoint | Description |
|---|---|---|
| **POST** | `/api/courses` | Create a new course |
| **GET** | `/api/courses` | Retrieve all courses |
| **GET** | `/api/courses/{id}` | Get course by ID |
| **PUT** | `/api/courses/{id}` | Update course details |
| **DELETE** | `/api/courses/{id}` | Delete a course by ID |
| **GET** | `/api/courses/search?title=...` | Search course by title |
| **GET** | `/api/courses/fee-range?minFee=...&maxFee=...` | Filter courses by price range |

### **Enrollment Endpoints (`/api/enrollments`)**
| Method | Endpoint | Description |
|---|---|---|
| **POST** | `/api/enrollments` | Enroll a student into a course |
| **GET** | `/api/enrollments` | List all active enrollments |
| **DELETE** | `/api/enrollments/{id}` | Cancel an enrollment by ID |
| **GET** | `/api/enrollments/student/{studentId}/courses` | Fetch courses enrolled by a student |
| **GET** | `/api/enrollments/course/{courseId}/students` | Fetch students enrolled in a course |

---

## 📄 License
This project is for educational and learning purposes under Naresh IT (NIT) coursework.
