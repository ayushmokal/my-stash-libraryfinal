import { CategorySection } from "@/components/stash/CategorySection";
import PublicProductCard from "./PublicProductCard";

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

interface PublicProfileContentProps {
  username: string;
  categories: Category[];
  products: Product[];
}

const PublicProfileContent = ({ username, categories, products }: PublicProfileContentProps) => {
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

export default PublicProfileContent;