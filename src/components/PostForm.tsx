import React, { useState } from 'react';
import { Send } from 'lucide-react';

const PostForm = () => {
  const [tweet, setTweet] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/post-tweet', {
        method: 'POST',
        body: JSON.stringify({ text: tweet }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setTweet('');
        alert('Tweet publicado exitosamente!');
      }
    } catch (error) {
      console.error('Error al publicar tweet:', error);
      alert('Error al publicar el tweet');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="mb-4">
        <textarea
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="¿Qué está pasando?"
          rows={4}
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            {tweet.length}/280 caracteres
          </span>
          <button
            type="submit"
            disabled={!tweet.trim()}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
            <span>Publicar</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;