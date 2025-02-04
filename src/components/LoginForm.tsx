import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSubmit: (name: string, email: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isLoading = false, error = null }: LoginFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome to Dog Shelter</CardTitle>
        <CardDescription>
          Find your perfect furry friend. Please login to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 relative">
            <Label htmlFor="name" className="w-20">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
              className="w-[230px]"
            />
          </div>
          <div className="flex items-center gap-4 relative">
            <Label htmlFor="email" className="w-20">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-[230px]"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 mt-2">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}