# Reemo - B2B Team Project Management App
![image](https://github.com/user-attachments/assets/9f8dbb40-e834-4a58-b3c4-2ca4fb8cc4cb)

**Reemo** is a comprehensive B2B Team Project Management App designed to enhance collaboration and streamline project workflows within teams. This application offers a robust suite of features, including project creation, task management, user authentication, and workspace management, all within an intuitive and user-friendly interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

**Reemo** provides a rich set of features to empower teams and boost productivity:

- **User Authentication:** Secure user authentication with email and Google OAuth integration, ensuring data protection and controlled access.
- **Project and Task Management:** Efficiently manage projects and tasks with features such as creating projects, assigning tasks, setting deadlines, and tracking progress.
- **Workspace Management:** Organize projects and teams within dedicated workspaces, facilitating focused collaboration and efficient resource allocation.
- **Real-time Notifications:** Stay informed with real-time notifications, keeping users updated on project developments and task assignments.
- **Role-based Access Control:** Define user roles and permissions to ensure data security and streamline workflows by granting appropriate access levels.

## Tech Stack

**Reemo** leverages a modern and robust tech stack to deliver a seamless user experience and optimal performance.

### Frontend

- **React:** A JavaScript library for building user interfaces with a focus on component reusability and efficient rendering.
- **TypeScript:** A typed superset of JavaScript that enhances code maintainability and reduces errors.
- **Vite:** A fast and efficient build tool that optimizes development workflows and improves performance.
- **Tailwind CSS:** A utility-first CSS framework that provides a wide range of pre-defined classes for rapid UI development.
- **Radix UI:** A collection of unstyled, accessible UI components that offer flexibility and customization options.

### Backend

- **Node.js:** A JavaScript runtime environment that enables server-side execution of code.
- **Express:** A minimalist web framework for Node.js that simplifies routing and API development.
- **MongoDB:** A NoSQL database that provides flexibility and scalability for data storage.
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB that facilitates data interaction and schema definition.
- **Passport.js:** A popular authentication middleware for Node.js that supports various authentication strategies.
- **JWT (JSON Web Token):** A standard for securely transmitting information between parties as a JSON object.

## Installation

To get **Reemo** up and running on your local machine, follow these steps:

### Prerequisites

Ensure you have the following prerequisites installed:

- **Node.js:** Version 14 or higher.
- **npm or yarn:** Package managers for installing dependencies.
- **MongoDB:** A local or remote MongoDB instance.

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/reemo.git
   cd reemo
   ```

2. **Install dependencies:**

   Navigate to both the `client` and `backend` directories and install the necessary dependencies:

   ```bash
   cd client
   npm install
   cd../backend
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the `backend` directory and populate it with the following environment variables, replacing the placeholders with your actual values:

   ```env
   PORT=8000
   NODE_ENV=development

   MONGO_URI="your-mongo-uri"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="1d"

   SESSION_SECRET="your-session-secret"
   SESSION_EXPIRES_IN="1d"

   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_CALLBACK_URL="http://localhost:8000/api/auth/google/callback"

   FRONTEND_ORIGIN="http://localhost:3000"
   FRONTEND_GOOGLE_CALLBACK_URL="http://localhost:3000/google/oauth/callback"
   ```

## Usage

Once you have completed the installation steps, you can start using **Reemo** locally.

### Running the Development Server

1. **Start the backend server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend server:**

   ```bash
   cd client
   npm run dev
   ```

### Building for Production

To prepare **Reemo** for production deployment, follow these steps:

1. **Build the backend:**

   ```bash
   cd backend
   npm run build
   ```

2. **Build the frontend:**

   ```bash
   cd client
   npm run build
   ```

## Environment Variables

The following environment variables are essential for configuring **Reemo**:

- `PORT`: Specifies the port on which the backend server will run.
- `NODE_ENV`: Defines the environment in which the app is running (development or production).
- `MONGO_URI`: Provides the URI for connecting to your MongoDB database.
- `JWT_SECRET`: Sets the secret key for signing JWT tokens used for authentication.
- `JWT_EXPIRES_IN`: Determines the expiration time for JWT tokens.
- `SESSION_SECRET`: Sets the secret key for session management.
- `SESSION_EXPIRES_IN`: Determines the expiration time for sessions.
- `GOOGLE_CLIENT_ID`: Provides the client ID for Google OAuth integration.
- `GOOGLE_CLIENT_SECRET`: Provides the client secret for Google OAuth integration.
- `GOOGLE_CALLBACK_URL`: Specifies the callback URL for Google OAuth.
- `FRONTEND_ORIGIN`: Sets the origin URL for the frontend.
- `FRONTEND_GOOGLE_CALLBACK_URL`: Specifies the callback URL for Google OAuth on the frontend.

## Scripts

**Reemo** includes several npm scripts to streamline development and deployment processes.

### Backend

- `npm run dev`: Starts the backend server in development mode.
- `npm run build`: Builds the backend for production deployment.
- `npm run start`: Starts the backend server in production mode.
- `npm run seed`: Seeds the database with initial data.

### Frontend

- `npm run dev`: Starts the frontend server in development mode.
- `npm run build`: Builds the frontend for production deployment.
- `npm run preview`: Previews the production build locally.

## Folder Structure

The **Reemo** project follows a well-organized folder structure to ensure code maintainability and clarity.

```
Reemo/
├── backend/
│   ├── src/
│   │   ├── @types/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── enums/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seeders/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   ├──.env
│   ├── package.json
│   └── tsconfig.json
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── main.tsx
│   ├──.env
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── README.md
└──.gitignore
```

## Contributing

Contributions to **Reemo** are highly welcome! If you would like to contribute, please open an issue or submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License.
