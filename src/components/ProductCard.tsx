import { useState } from 'react';
import type { Product } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
}: ProductCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const activeColor = product.colors[selectedColorIdx] || product.colors[0];
  const displayImage = activeColor?.image || product.images[0] || '';

  return (
    <article className="group flex flex-col bg-[#140406]/95 border border-[#DFCDAE]/40 p-4 shadow-xl backdrop-blur-sm">
      {/* Studio Sample Photo */}
      <div className="relative aspect-[3/4] bg-[#22070a] border border-[#DFCDAE]/30 overflow-hidden mb-3.5">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="block w-full h-full text-left cursor-pointer"
          aria-label={`View ${product.name}`}
        >
          <ImageWithFallback
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </button>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 border border-[#F5C518]/0 group-hover:border-[#F5C518]/60 transition-colors duration-500"
        />
      </div>

      {/* Colour Swatches */}
      {product.colors.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          {product.colors.map((color, idx) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColorIdx(idx)}
              title={color.name}
              aria-label={`Select colour ${color.name}`}
              className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                idx === selectedColorIdx
                  ? 'ring-2 ring-[#F5C518] ring-offset-2 ring-offset-[#140406] scale-105'
                  : 'ring-1 ring-white/30 hover:scale-110'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
          <span className="text-[11px] tracking-wide text-[#EADFC7] ml-1 truncate">
            {activeColor?.name}
          </span>
        </div>
      )}

      {/* Unboxed Clean Label */}
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-[#F5C518] font-semibold mb-1">
        <span>{product.category}</span>
        <span aria-hidden="true">·</span>
        <span className="truncate text-[#EADFC7]">{product.collection}</span>
      </div>

      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        className="font-editorial text-left text-lg sm:text-[19px] font-normal text-[#FFFDF8] hover:text-[#F5C518] transition-colors leading-snug cursor-pointer"
      >
        {product.name}
      </button>
    </article>
  );
}
