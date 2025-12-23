import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Package } from 'lucide-react';

interface Suggestion {
  type: 'product';
  id: string;
  name: string;
  slug: string;
  image?: string;
  price?: number;
  comparePrice?: number;
}

interface SearchSuggestionsProps {
  query: string;
  onClose: () => void;
  className?: string;
}

export default function SearchSuggestions({ query, onClose, className = '' }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.data || []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onClose();
    router.push(`/products/${suggestion.slug}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (!query.trim() || query.length < 2) {
    return null;
  }

  return (
    <div className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
          <span className="ml-2 text-gray-500">Đang tìm kiếm...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion: Suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-center gap-3"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                {suggestion.image ? (
                  <img
                    src={suggestion.image}
                    alt={suggestion.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <Package size={16} className="text-gray-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">{suggestion.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Sản phẩm
                  </span>
                </div>

                {suggestion.price && (
                  <div className="text-sm text-gray-600">
                    {suggestion.comparePrice && suggestion.comparePrice > suggestion.price ? (
                      <div className="flex items-center gap-2">
                        <span className="line-through text-gray-400">{formatPrice(suggestion.comparePrice)}</span>
                        <span className="text-red-500 font-semibold">{formatPrice(suggestion.price)}</span>
                      </div>
                    ) : (
                      <span>{formatPrice(suggestion.price)}</span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-4 px-4 text-center text-gray-500">
          Không tìm thấy kết quả phù hợp
        </div>
      )}

      {/* Search all button */}
      {query.trim() && (
        <div className="border-t border-gray-200 p-2">
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Search size={16} />
            <span className="font-medium">Tìm tất cả "{query}"</span>
          </Link>
        </div>
      )}
    </div>
  );
}
