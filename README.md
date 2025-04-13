# URL Shortener Application

## Test Credentials
Use these credentials to test the application:
```
Email: intern@dacoid.com
Password: Test123
```

## Overview
A modern URL shortening service built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create shortened URLs with optional custom aliases and expiration dates, while providing detailed analytics for each shortened link.

## Features
- **URL Shortening**: Convert long URLs into short, manageable links
- **Link Expiration**: Set expiration dates for temporary links
- **Analytics Dashboard**: Track link performance with metrics like:
  - Click counts
  - Visitor demographics
  - Device types
  - Browser information
  - Operating systems
- **User Authentication**: Secure account management
- **QR Code Generation**: Generate QR codes for easy sharing on smartphones
- **Responsive Design**: Works seamlessly across all devices

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
1. Register a new account or use the test credentials provided above
2. Log in to access the dashboard
3. Enter a long URL in the shortener form
4. Optionally add a custom alias and expiration date
5. Click "Shorten URL" to generate your short link
6. Access analytics for your shortened URLs in the dashboard

## Technologies Used
- **Frontend**: React, Redux, Tailwind CSS, Chart.js, QR code API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT