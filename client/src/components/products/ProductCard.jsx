import { Link } from 'react-router-dom';
import { formatCurrency, getImageUrl } from '../../utils/formatCurrency';

export default function ProductCard({ product, onAdd }) {
  const image = getImageUrl(product.images?.[0]?.url);

  return (
    <article className="card group overflow-hidden p-0 transition hover:shadow-md">
      <Link
        to={`/shop/${product._id}`}
        className="flex h-56 items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain p-3 transition group-hover:scale-105"
        />
      </Link>
      <div className="p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {product.category}
        </span>
        <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">
          <Link to={`/shop/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-end">
          {onAdd && (
            <button type="button" onClick={() => onAdd(product)} className="btn-primary text-sm py-2">
              Add to Box
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
