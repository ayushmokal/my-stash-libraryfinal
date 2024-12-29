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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching profile for username:', username);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("username", username)
          .maybeSingle();

        if (error) {
          console.error('Error fetching profile:', error);
          throw error;
        }
        
        if (!data) {
          console.log('No profile found for username:', username);
          setError(`Profile "${username}" not found`);
          return;
        }

        console.log('Found profile:', data);
        setUserId(data.id);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      fetchUserId();
    }
  }, [username]);

  const { data: categories = [] } = useQuery({
    queryKey: ["public-categories", userId],
    queryFn: async () => {
      if (!username || !userId) throw new Error("Username and userId are required");

      try {
        // Set the username parameter for RLS policy
        const { error: rpcError } = await supabase.rpc('set_request_parameter', {
          name: 'username',
          value: username
        });

        if (rpcError) {
          console.error('Error setting request parameter:', rpcError);
          throw rpcError;
        }

        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error('Error fetching categories:', error);
          throw error;
        }

        return data as Category[];
      } catch (err) {
        console.error('Error in categories query:', err);
        throw err;
      }
    },
    enabled: !!userId && !!username,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["public-products", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

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