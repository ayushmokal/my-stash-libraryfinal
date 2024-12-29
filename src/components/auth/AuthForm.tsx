import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Successfully signed in!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-center">My stash</h1>
      <h2 className="text-2xl font-semibold text-center mb-8">Sign in to your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-stash-gray"
          disabled={isLoading}
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-stash-gray"
          disabled={isLoading}
        />

        <div className="text-center text-sm text-gray-500">or</div>

        <Button 
          type="button"
          variant="outline"
          className="w-full bg-white hover:bg-gray-50"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          Sign in with Google
        </Button>

        <Button 
          type="submit"
          className="w-full bg-stash-purple hover:bg-stash-purple-light"
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;