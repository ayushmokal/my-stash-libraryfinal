import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication
    toast({
      title: "Coming soon!",
      description: "Authentication will be implemented in the next version.",
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-center">My stash</h1>
      <h2 className="text-2xl font-semibold text-center mb-8">Create your account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-stash-gray"
        />
        
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-stash-gray"
        />

        <div className="text-center text-sm text-gray-500">or</div>

        <Button 
          type="button"
          variant="outline"
          className="w-full bg-white hover:bg-gray-50"
          onClick={() => toast({
            title: "Coming soon!",
            description: "Google Sign In will be implemented in the next version.",
          })}
        >
          Sign up with Google
        </Button>

        <Button 
          type="submit"
          className="w-full bg-stash-purple hover:bg-stash-purple-light"
        >
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default AuthForm;