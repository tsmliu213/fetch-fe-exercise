import './App.css'

import { LoginForm } from "@/components/LoginForm";

function App() {
  const handleLogin = (name: string, email: string) => {
    // TODO: Implement login functionality in the next step
    console.log("Login attempt with:", { name, email });
  };

  return (
    <div className="flex items-center justify-center">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}

export default App;