import './App.css'
import { LoginForm } from "@/components/LoginForm";
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Search from '@/views/Search';
import Match from '@/views/Match';

import { Dog } from '@/types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  const clearMatchedDog = () => {
    setMatchedDog(null);
  };

  const handleLogin = async (name: string, email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed. Please try again.');
      }

      // Login successful
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreedsChange = (breeds: string[]) => {
    setSelectedBreeds(breeds);
  };

  const handleToggleFavorite = (dog: Dog) => {
    setFavoriteDogs(prev => {
      const exists = prev.some(d => d.id === dog.id);
      if (exists) {
        return prev.filter(d => d.id !== dog.id);
      } else {
        return [...prev, dog];
      }
    });
  };

  const handleGenerateMatch = async () => {
    if (favoriteDogs.length === 0) return;
  
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(favoriteDogs.map(dog => dog.id))
      });
  
      if (!response.ok) throw new Error('Failed to generate match');
  
      const data = await response.json();
      const foundMatchedDog = favoriteDogs.find(dog => dog.id === data.match);
      if (foundMatchedDog) {
        setMatchedDog(foundMatchedDog);
      }
    } catch (err) {
      console.error('Error generating match:', err);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/search" replace />
            ) : (
              <div className="flex items-center justify-center">
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
              </div>
            )
          }
        />
        <Route
          path="/search"
          element={isAuthenticated ? 
            <Search 
              selectedBreeds={selectedBreeds} 
              onBreedsChange={handleBreedsChange}
              favoriteDogs={favoriteDogs}
              onToggleFavorite={handleToggleFavorite}
              onGenerateMatch={handleGenerateMatch}
              matchedDog={matchedDog}
            /> : 
            <Navigate to="/" replace />
          }
        />
        <Route
          path="/match"
          element={isAuthenticated ? <Match matchedDog={matchedDog} onClearMatch={clearMatchedDog} /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;