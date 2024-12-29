import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import AddStuffCard from "@/components/stash/AddStuffCard";
import CategorySection from "@/components/stash/CategorySection";

const Index = () => {
  const isAuthenticated = false; // TODO: Implement authentication state

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My stash</h1>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
        </Button>
      </header>

      <div className="space-y-12">
        <CategorySection title="Setup">
          <AddStuffCard />
        </CategorySection>

        <CategorySection title="Tech">
          <AddStuffCard />
        </CategorySection>

        <CategorySection title="Daily">
          <AddStuffCard />
        </CategorySection>
      </div>
    </div>
  );
};

export default Index;