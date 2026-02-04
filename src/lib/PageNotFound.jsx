import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <div className="text-center space-y-4 -mt-12">
        <h2 className="text-3xl font-bold text-gray-900">Strona nie znaleziona</h2>
        <p className="text-gray-500 max-w-md">
          Przepraszamy, ale strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-[#e6007e] hover:bg-[#c70069] text-white px-8"
        >
          Wróć do strony głównej
        </Button>
      </div>
    </div>
  );
}