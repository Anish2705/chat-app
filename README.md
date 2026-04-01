Real-Time Chat Application 💬

Overview
This project is a real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) along with Socket.io for real-time communication.

The main goal of this project is to simulate a messaging platform similar to WhatsApp or Slack, where users can communicate instantly, create groups, and share files.

Features

Real-time messaging using WebSockets (Socket.io)
One-to-one private chat between users
Group chat functionality (chat rooms)
File and image sharing
Persistent chat history stored in MongoDB
User authentication (Register & Login)
Clean and responsive user interface
Send messages using Enter key

Tech Stack

Frontend

React.js
Axios
React Router

Backend

Node.js
Express.js

Database

MongoDB Atlas

Real-time Communication

Socket.io

Project Structure

chat-app/
backend/
frontend/

How to Run the Project Locally

Prerequisites

Make sure you have the following installed:

Node.js (v18 or above recommended)
npm
MongoDB Atlas account

Backend Setup

Go to backend folder:
cd backend

Install dependencies:
npm install
Create a .env file inside backend folder and add:
MONGO_URI=mongodb_connection_string
PORT=5000
Start the backend server:
npm start

Backend will run on:
http://localhost:5000

Frontend Setup

Go to frontend folder:
cd frontend
Install dependencies:
npm install
Start the React app:
npm start

Frontend will run on:
http://localhost:3000

How the Application Works

Users first register and log in
After login, they can see existing chats
They can start a new chat or create a group
Messages are sent in real-time using Socket.io
All messages are saved in MongoDB for future access
Users can also send images and files