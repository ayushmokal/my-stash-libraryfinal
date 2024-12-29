import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const location = useLocation();
  const username = location.state?.username;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-50">
      <AuthForm initialUsername={username} />
    </div>
  );
};

export default Auth;