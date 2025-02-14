import './App.css'
import React, { useEffect } from 'react';
import { RouterProvider } from "react-router-dom";
import router from './router.jsx';
import { ContextProvider } from './context/contextProvider.jsx';
import { generateToken, messaging } from './firebase.js';
import { onMessage } from 'firebase/messaging';
import toast, { Toaster } from "react-hot-toast";
import { CodeSquare } from 'lucide-react';

function App() {
  useEffect(() => {
    generateToken()
    onMessage(messaging, (payload) => {
      console.log(payload.notification.body)
      toast(payload.notification.body)
    })
  }, [])
  return (
    <ContextProvider>
      <Toaster position='botton-right' toastOptions={{
        // Define default options
        style: {
          background: '#cf9116',
          color: '#fff',
        },


      }} />
      <div dir="rtl">
        <RouterProvider router={router} />
      </div>
    </ContextProvider>
  )
}

export default App
