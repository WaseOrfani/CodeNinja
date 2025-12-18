import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Badge } from './ui/badge';

export const ProductCard = ({ product }) => {
  const lowestPrice = Math.min(...product.variants.map(v => v.price));
  
  return (
    <Link 
      to={`/product/${product.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-green-200 transition-all duration-300 hover:shadow-md product-card"
      data-testid={`product-card-${product.id}`}
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 product-image"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mt-1">{product.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-green-600">ab €{lowestPrice.toFixed(2)}</span>
            {product.is_halal && (
              <Badge variant="secondary" className="bg-green-50 text-green-700 text-[10px] font-medium">
                Halal
              </Badge>
            )}
          </div>
          <div className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:bg-green-600 transition-colors shadow-md shadow-green-500/20">
            <Plus className="w-5 h-5" strokeWidth={2} />
          </div>
        </div>
        
        {product.is_bestseller && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-orange-500 text-white text-[10px] font-bold">
              Bestseller
            </Badge>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
