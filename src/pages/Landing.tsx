import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleUsernameCheck = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", username)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        toast.error("This username is already taken");
        return;
      }

      navigate("/auth", { state: { username } });
    } catch (error: any) {
      toast.error(error.message || "Failed to check username");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">My Stash</h1>
          <h2 className="text-2xl font-semibold">First, claim your unique link</h2>
          <p className="text-muted-foreground">The good ones are still available!</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground whitespace-nowrap">mystash.me/</span>
            <Input
              type="text"
              placeholder="your-name"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="bg-white"
            />
          </div>

          <Button
            onClick={handleUsernameCheck}
            disabled={isChecking}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            {isChecking ? "Checking..." : "Grab my Link"}
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              or{" "}
              <button
                onClick={() => navigate("/auth")}
                className="text-blue-600 hover:underline"
              >
                log in
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;