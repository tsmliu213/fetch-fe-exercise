import './App.css'

import { LoginForm } from "@/components/LoginForm";
import { useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log('Login successful!');
      // TODO: Implement redirect to search page in the next step
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
    </div>
  );
}

export default App;