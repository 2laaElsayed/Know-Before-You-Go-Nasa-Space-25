import React from 'react';
import ThemeToggle from '../Context/ThemeToggle.jsx'; 

function MainLayout({ children }) {
  return (
    <div className="min-h-screen relative transition-colors duration-500 
                bg-gray-50 text-gray-900 
                dark:bg-gray-800 dark:text-gray-100">
      
     
      <div className="absolute top-4 right-4 z-20"> 
        <ThemeToggle />
      </div>

    
      <main className=""> 
        {children}
      </main>

    </div>
  );
}

export default MainLayout;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaEdit, FaDownload } from "react-icons/fa";

import cloudLogo from "../../assets/icon.png";
import sunImg from "../../assets/2.png";
import cloudImg from "../../assets/4.png";
import rainImg from "../../assets/1.png";

