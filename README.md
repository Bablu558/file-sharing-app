# File Sharing Application

This is a file-sharing application developed using the MERN stack. It allows users to register, login, and share files in real-time with socket.io and JWT-based authentication.

## Features
- **User Authentication**: Register and login with JWT.
- **File Sharing Application  **: Upload and Sharing view files (excluding `.exe`) immediately using socket.io.
- **Real-time Updates**: Users see file uploads in real-time.
- **User-friendly Interface**: Clean and easy-to-navigate design.

## Technologies Used
- **MongoDB**: Database for storing user and file information.
- **Express**: Server-side framework.
- **React**: Frontend library for UI.
- **Node.js**: Backend runtime.
- **Socket.io**: Real-time communication.
- **JWT**: User authentication.

## Setup Instructions
1. Clone the repository:  
   `git clone https://github.com/your-username/file-sharing-app.git`
2. Navigate to the project directory:  
   `cd file-sharing-app`
3. Install dependencies:  
   - For server:  
     `cd server`  
     `npm install`
   - For client:  
     `cd client`  
     `npm install`
4. Create a `.env` file in the `server` folder with the following content:
5. Start the server:  
`cd server`  
`npm start`
6. Start the client:  
`cd client`  
`npm start`
7. Access the application at `http://localhost:3000`.

## Deliverables
- Full source code for the client and server.
- Real-time updates via socket.io.
- JWT authentication for user sessions.

---

### Step 5: Verify the Upload
1. Check if the `.env` and `node_modules` were excluded.
2. Ensure all code changes are pushed:  
```bash
git status  # Confirm no changes are left

