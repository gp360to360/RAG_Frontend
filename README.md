# **RAG-Powered News Chatbot \- Frontend**

This repository contains the frontend for a full-stack, Retrieval-Augmented Generation (RAG) powered chatbot. The user interface is built as a modern Single Page Application (SPA) using React and Vite, providing a seamless and interactive chat experience.

## **🚀 Features**

* **Interactive Chat Interface:** A clean and modern UI for sending and receiving messages.  
* **Real-time Streaming:** Displays AI responses word-by-word as they are generated for an enhanced user experience.  
* **Session Management:** Automatically creates and persists a unique session ID for each user in the browser's local storage.  
* **Chat History:** Loads and displays the user's past conversation history upon revisiting the application.  
* **Reset Session:** Allows users to clear their current chat history and start a new session with a single click.  
* **Responsive Design:** The interface is fully responsive and works seamlessly on both desktop and mobile devices.

## **🛠️ Tech Stack**

* **React:** A JavaScript library for building dynamic and component-based user interfaces.  
* **Vite:** A modern, high-performance build tool for frontend development.  
* **Tailwind CSS:** A utility-first CSS framework for rapid and responsive UI development.  
* **@microsoft/fetch-event-source:** A library to handle Server-Sent Events (SSE) for streaming API responses.  
* **uuid:** Used to generate unique identifiers for sessions and messages.

## **⚙️ Setup and Installation**

Follow these steps to get the frontend running on your local machine.

### **Prerequisites**

* [Node.js](https://nodejs.org/) (v18 or higher recommended)  
* pnpm package manager (or npm/yarn)  
* The backend server must be running.

### **Installation**

1. **Clone the repository:**  
   git clone \[https://github.com/your-username/your-frontend-repo-link.git\](https://github.com/your-username/your-frontend-repo-link.git)  
   cd your-frontend-repo-folder

2. **Install dependencies:**  
   pnpm install

3. Configure Environment Variables:  
   This project requires a single environment variable to know the address of the backend API. Create a new file named .env in the root of the project directory.  
   \# .env  
   REACT\_APP\_API\_URL=http://localhost:8000/api/chat

   *Note: The React code is already set up to use this variable. It will fall back to http://localhost:8000/api/chat if the variable is not set.*

### **Running the Development Server**

Start the Vite development server. The application will be available at http://localhost:3000.

pnpm run dev

## **📦 Building for Production**

To create an optimized production build, run the following command. The output will be generated in the dist folder.

pnpm run build

## **☁️ Deployment**

This application is built as a static site and is optimized for deployment on platforms like **Render**, **Vercel**, or **Netlify**.

When deploying, use the following settings:

* **Build Command:** pnpm run build  
* **Publish Directory:** dist

Remember to set the REACT\_APP\_API\_URL environment variable in your deployment platform's settings to the public URL of your live backend API.