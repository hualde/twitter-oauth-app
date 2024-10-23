import React, { useState, useEffect } from 'react';
import TwitterLogin from './components/TwitterLogin';
import PostForm from './components/PostForm';
import { Twitter } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar el estado de autenticación al cargar
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/.netlify/functions/auth-status');
      const data = await response.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Twitter className="text-[#1DA1F2]" size={32} />
              <span className="text-xl font-bold">Twitter Poster</span>
            </div>
            {isAuthenticated && (
              <button 
                onClick={() => window.location.href = '/.netlify/functions/logout'}
                className="text-gray-600 hover:text-gray-800"
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center gap-8">
          {!isAuthenticated ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-6">
                Bienvenido a Twitter Poster
              </h1>
              <p className="text-gray-600 mb-8">
                Inicia sesión con tu cuenta de Twitter para comenzar a publicar
              </p>
              <TwitterLogin />
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Crear nuevo tweet</h2>
              <PostForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;