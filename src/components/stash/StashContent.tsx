import { ReactNode } from "react";
import CategorySection from "./CategorySection";
import AddStuffCard from "./AddStuffCard";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  user_id: string;
}

interface StashContentProps {
  categories: Category[];
  products: Product[];
  onAddCategory: () => void;
}

const StashContent = ({ categories, products, onAddCategory }: StashContentProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h2 className="text-2xl font-semibold mb-4">Welcome to My Stash!</h2>
        <p className="text-muted-foreground mb-8">
          Get started by creating your first category to organize your stuff.
        </p>
        <Button onClick={onAddCategory} className="hover:scale-105 transition-transform">
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="w-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-center mb-2">My Stash</h1>
        <p className="text-center text-muted-foreground">Organize and share your favorite products</p>
      </div>
      
      {categories.map((category) => (
        <CategorySection key={category.id} title={category.name}>
          {products
            .filter((product) => product.category_id === category.id)
            .map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          <AddStuffCard />
        </CategorySection>
      ))}
    </div>
  );
};

export default StashContent;