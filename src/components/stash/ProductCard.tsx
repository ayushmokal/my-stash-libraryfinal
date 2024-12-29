import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  product: {
    name: string;
    brand: string | null;
    image_url: string | null;
    affiliate_link: string | null;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {product.image_url && (
        <div className="aspect-square w-full overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
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

export default ProductCard;