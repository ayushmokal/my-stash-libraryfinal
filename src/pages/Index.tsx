import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import AddStuffCard from "@/components/stash/AddStuffCard";
import CategorySection from "@/components/stash/CategorySection";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ProductCard from "@/components/stash/ProductCard";
import ProfileSettings from "@/components/profile/ProfileSettings";
import AddCategoryForm from "@/components/stash/AddCategoryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  affiliate_link: string | null;
  category_id: string;
}

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load categories");
        throw error;
      }

      return data as Category[];
    },
    enabled: !!session,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Failed to load products");
        throw error;
      }

      return data as Product[];
    },
    enabled: !!session,
  });

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign out");
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  if (categoriesLoading || productsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8 space-y-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My stash</h1>
        <div className="flex items-center gap-4">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <AddCategoryForm />
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {session.user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Account settings coming soon!")}>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <ProfileSettings
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        userEmail={session.user.email}
      />

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Welcome to My Stash!</h2>
          <p className="text-muted-foreground mb-8">
            Get started by creating your first category to organize your stuff.
          </p>
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Category
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map((category) => (
            <CategorySection key={category.id} title={category.name}>
              {products
                .filter((product) => product.category_id === category.id)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              <AddStuffCard />
            </CategorySection>
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;