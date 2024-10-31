# Next.js LMS Application with Supabase Backend

This project is a Learning Management System (LMS) built using Next.js and Supabase. It provides role-based access to courses, lessons, assignments, notifications, and chat functionality for users with different roles: Teacher, Student, and Guest. The app includes various features like course enrollment, real-time notifications, lesson scheduling, assignment submissions, and user messaging, along with permission handling and notifications using Firebase Cloud Messaging (FCM).

## Table of Contents

- [Next.js LMS Application with Supabase Backend](#nextjs-lms-application-with-supabase-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Setup Instructions](#setup-instructions)
  - [Usage](#usage)

## Features

- **Role-based access**: Supports roles like Teacher, Student, and Guest.
- **Courses and Lessons**: Users can create, enroll in, and view courses. Teachers can manage lessons and assignments.
- **Assignments and Grading**: Assignments can be created and submitted by students, graded by teachers.
- **Notifications**: Real-time notifications for enrollments, submissions, and assignments.
- **Messaging and File Sharing**: Users can participate in lesson-based chats, with support for file sharing.
- **Subscription Management**: Handles user subscriptions through PayPal.

## Setup Instructions

1.  **Clone the Repository**: Clone the Next.js project repository to your local machine.
2.  **Install Dependencies**: Run `npm install` to install project dependencies.
3.  **Environment Variables**: Configure your `.env` file with your Supabase API keys and any other required credentials.
4.  **Database Initialization**: Use the SQL code provided in this README to set up your Supabase tables and types.
5.  **Run the Application**: Start the Next.js server using `npm run dev`.

## Usage

1.  **User Registration**: Users sign up, and their profile and settings are initialized automatically.
2.  **Course and Lesson Creation**: Teachers can create courses and lessons. Teachers can enroll students in courses.
3.  **Assignments**: Teachers create assignments; students submit work, and teachers can grade it.
4.  **Notifications**: Users receive real-time notifications based on their actions in the system.
5.  **Messaging**: Users can chat and share files within lessons.

This Next.js LMS project provides a comprehensive foundation for creating a dynamic and scalable learning platform with role-based access and real-time notifications using Supabase.
