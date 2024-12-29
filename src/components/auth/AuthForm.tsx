import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  initialUsername?: string;
}

const AuthForm = ({ initialUsername = "" }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (initialUsername) {
        // Sign up flow
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: initialUsername,
            },
          },
        });

        if (signUpError) throw signUpError;

        toast.success("Successfully signed up!");
      } else {
        // Sign in flow
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast.success("Successfully signed in!");
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to authenticate");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">My stash</h1>
        {initialUsername ? (
          <>
            <h2 className="text-2xl font-semibold">Now, create your account</h2>
            <p className="text-muted-foreground">mystash.me/{initialUsername} is yours!</p>
          </>
        ) : (
          <h2 className="text-2xl font-semibold">Sign in to your account</h2>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white"
          disabled={isLoading}
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white"
          disabled={isLoading}
        />

        <Button 
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white"
          disabled={isLoading}
        >
          {initialUsername ? "Create Account" : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;