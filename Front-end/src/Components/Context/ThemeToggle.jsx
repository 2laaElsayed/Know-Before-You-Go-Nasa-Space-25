
import React from 'react';
import { useTheme } from './ThemeContext.jsx'; 

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    
    <div 
      onClick={toggleTheme} 
      className="flex items-center space-x-2 p-1 rounded-full cursor-pointer 
                 transition duration-300 hover:opacity-70"
    >
      
      <div className={`w-10 h-6 flex items-center rounded-full  transition-colors 
        ${theme === 'light' ? 'bg-gray-400' : 'bg-gray-600'}`}> 
        <div 
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}
        >
        </div>
      </div>
      
      <span className="text-lg text-white font-serif select-none">
        {theme === 'light' ? 'Cloudy!' : 'Sunny!'}
      </span>
    </div>
  );
}

export default ThemeToggle;