import './App.css'
import { LoginForm } from "@/components/LoginForm";
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Search from '@/views/Search';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          element={isAuthenticated ? <Search /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;