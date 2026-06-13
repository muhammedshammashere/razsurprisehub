import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/formatCurrency';
import { useGiftBox } from '../../context/GiftBoxContext';
import { CATEGORY_EMOJIS } from '../../utils/constants';

export default function ProductCard({ product, onAdd }) {
  const image = getImageUrl(product.images?.[0]?.url);
  const { getAvailableStock } = useGiftBox();
  const availableStock = getAvailableStock(product);

  return (
    <article className="card group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10">
      <Link
        to={`/shop/${product._id}`}
        className="surface-gradient flex h-56 items-center justify-center overflow-hidden border-b border-brand-900/10 dark:border-brand-400/15"
      >
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="p-4">
        <span className="flex w-fit items-center gap-1 rounded-full border border-brand-500/20 bg-brand-50/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-900 dark:border-brand-400/20 dark:bg-white/10 dark:text-brand-200">
          <span>{CATEGORY_EMOJIS[product.category] || '🎁'}</span>
          <span>{product.category}</span>
        </span>
        <h3 className="mt-1 font-semibold text-gray-900 dark:text-white">
          <Link to={`/shop/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-end">
          {onAdd && (
            <button
              type="button"
              onClick={() => onAdd(product)}
              disabled={availableStock < 1}
              className="btn-primary py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {availableStock < 1 ? 'Out of Stock' : 'Add to Box'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
