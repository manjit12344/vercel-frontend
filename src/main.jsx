import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY=import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
createRoot(document.getElementById('root')).render(
 
   
       <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
        </ClerkProvider>
       </BrowserRouter>
  
)
