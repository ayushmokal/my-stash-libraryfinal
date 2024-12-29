import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CategorySection from "@/components/stash/CategorySection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
  affiliate_link: string | null;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

const PublicProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group relative flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {product.image_url && (
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{product.name}</CardTitle>
        {product.brand && (
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        )}
      </CardHeader>
      {product.affiliate_link && (
        <CardContent>
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            Buy now <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </CardContent>
      )}
    </Card>
  );
};

const PublicProfile = () => {
  const { username } = useParams();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (data) {
        setUserId(data.id);
      }
    };

    if (username) {
      fetchUserId();
    }
  }, [username]);

  const { data: categories = [] } = useQuery({
    queryKey: ["public-categories", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Category[];
    },
    enabled: !!userId,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["public-products", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!userId,
  });

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{username}'s stash</h1>
      </header>

      <div className="space-y-12">
        {categories.map((category) => (
          <CategorySection key={category.id} title={category.name}>
            {products
              .filter((product) => product.category_id === category.id)
              .map((product) => (
                <PublicProductCard key={product.id} product={product} />
              ))}
          </CategorySection>
        ))}
      </div>
    </div>
  );
};

export default PublicProfile;