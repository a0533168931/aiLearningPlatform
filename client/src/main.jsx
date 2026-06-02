import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import router from "./routes";
createRoot(document.getElementById('root')).render(
   <RouterProvider router={router} />

    // <App />
  
)
