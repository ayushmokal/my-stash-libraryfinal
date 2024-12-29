import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string | null;
    image_url: string | null;
    affiliate_link: string | null;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        {product.image_url && (
          <div className="aspect-square w-full overflow-hidden bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl line-clamp-2">{product.name}</CardTitle>
        {product.brand && (
          <p className="text-sm text-muted-foreground line-clamp-1">{product.brand}</p>
        )}
      </CardHeader>
      {product.affiliate_link && (
        <CardContent>
          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            View product <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </CardContent>
      )}
    </Card>
  );
};

export default ProductCard;