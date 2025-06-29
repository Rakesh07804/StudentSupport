Overview
Student Support is a web application designed to help students manage and access various campus services. The platform allows students to register, log in, raise complaints, view and participate in events, and report or find lost items.

Features

  User Authentication: Register, login, and logout functionality for students.
  
  Raise Complaints: Students can submit complaints regarding campus issues.
  
  Events: View upcoming events and event details.
  
  Lost & Found: Report lost items or claim found items.
  
  Personal Information: View and update personal details.
  
  Protected Routes: Certain pages are accessible only to authenticated users.
  
**Tech Stack**

**Frontend**

React.js: For building the user interface.

CSS: For styling components.

**Backend**

Node.js: JavaScript runtime for the server.

Express.js: Web framework for building RESTful APIs.

MongoDB: Database for storing user data, complaints, events, and lost & found items.

Mongoose: ODM for MongoDB.

JWT (JSON Web Tokens): For authentication and protected routes.

Multer: For handling file uploads (e.g., images for lost & found).

**Folder Structure**

_client/_: React frontend application.

_server/_: Node.js backend with Express and MongoDB.

Getting Started (Optional)

Clone the repository.

Install dependencies in both client and server folders.

Set up environment variables as needed.

Run the backend and frontend servers.

