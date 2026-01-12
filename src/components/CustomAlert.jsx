import React from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";

const CustomAlert = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-primary-100 p-6 transform transition-all animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4 text-primary-600">
            <FiAlertCircle className="w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-6 font-medium">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-lg transition-all active:scale-95"
          >
            Okay, I understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
