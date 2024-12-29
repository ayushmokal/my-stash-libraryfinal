import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import AddStuffCard from "@/components/stash/AddStuffCard";
import CategorySection from "@/components/stash/CategorySection";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ProductCard from "@/components/stash/ProductCard";

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
  category_id: string;  // Added this field to match the database schema
}

const Index = () => {
  const [session, setSession] = useState<any>(null);

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
        <Button variant="ghost" size="icon" onClick={() => supabase.auth.signOut()}>
          <User className="h-6 w-6" />
        </Button>
      </header>

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
    </div>
  );
};

export default Index;