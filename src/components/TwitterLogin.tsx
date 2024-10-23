import React from 'react';
import { Twitter } from 'lucide-react';

const TwitterLogin = () => {
  const handleLogin = async () => {
    // Redirigir al endpoint de autenticación de Twitter
    window.location.href = '/.netlify/functions/auth';
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center gap-2 bg-[#1DA1F2] text-white px-6 py-3 rounded-lg hover:bg-[#1a8cd8] transition-colors"
    >
      <Twitter size={24} />
      <span>Iniciar sesión con Twitter</span>
    </button>
  );
};

export default TwitterLogin;