'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  slug: string;
  addedAt?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  const storageAvailable = () => {
    try {
      const testKey = '__wishlist_test__'
      window.localStorage.setItem(testKey, testKey)
      window.localStorage.removeItem(testKey)
      return true
    } catch (error) {
      console.error('LocalStorage unavailable:', error)
      return false
    }
  }

  const readLocalWishlist = (): WishlistItem[] => {
    if (typeof window === 'undefined' || !storageAvailable()) return []

    const savedWishlist = window.localStorage.getItem('wishlist')
    if (!savedWishlist) return []

    try {
      return JSON.parse(savedWishlist)
    } catch (error) {
      console.error('Error parsing local wishlist:', error)
      return []
    }
  }

  const persistLocalWishlist = (wishlistItems: WishlistItem[]) => {
    if (typeof window === 'undefined' || !storageAvailable()) return

    try {
      window.localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
    } catch (error) {
      console.error('Error saving wishlist:', error)
    }
  }

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setItems(readLocalWishlist());
      setIsLoaded(true);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      persistLocalWishlist(items);
    }
  }, [items, isLoaded]);

  // Sync server wishlist when user changes
  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      setItems(readLocalWishlist())
      return
    }

    const syncWishlist = async () => {
      const localItems = readLocalWishlist()

      // Sync local items to server
      if (localItems.length > 0) {
        for (const item of localItems) {
          try {
            const response = await fetch('/api/wishlist', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ productId: item.id })
            })
            if (response.status === 401) {
              console.warn('Auth invalid during wishlist sync - keeping local wishlist')
              setItems(localItems)
              return
            }
          } catch (error) {
            console.error('Sync wishlist error:', error)
          }
        }
      }

      try {
        const response = await fetch('/api/wishlist', { credentials: 'include' })
        
        if (response.status === 401) {
          console.warn('Auth invalid - keeping local wishlist')
          const local = readLocalWishlist()
          if (local.length > 0) {
            setItems(local)
          }
          return
        }

        if (response.ok) {
          const data = await response.json()
          const serverItems: WishlistItem[] = (data.data || []).map((item: any) => {
            const product = item.product
            const basePrice = Number(product.price)
            const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined
            const finalPrice = comparePrice && comparePrice < basePrice ? comparePrice : basePrice

            return {
              id: product.id,
              name: product.name,
              price: finalPrice,
              discountPrice: comparePrice && comparePrice < basePrice ? comparePrice : undefined,
              image: product.images?.[0] || '',
              slug: product.slug,
              addedAt: item.addedAt
            }
          })

          if (serverItems.length === 0 && localItems.length > 0) {
            setItems(localItems)
          } else {
            setItems(serverItems)
            if (serverItems.length > 0) {
              persistLocalWishlist([])
            }
          }
        }
      } catch (error) {
        console.error('Failed to load wishlist from server:', error)
        const local = readLocalWishlist()
        if (local.length > 0) {
          setItems(local)
        }
      }
    }

    syncWishlist()
  }, [user, isLoaded])

  const addToWishlist = (item: WishlistItem) => {
    if (isInWishlist(item.id)) return;

    const optimisticUpdate = (prevItems: WishlistItem[]) => {
      return [...prevItems, item]
    }

    setItems((prevItems) => {
      const newItems = optimisticUpdate(prevItems)
      persistLocalWishlist(newItems)
      return newItems
    })

    if (!user) return

    fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId: item.id })
    }).then(async response => {
      if (!response.ok) {
        if (response.status === 401) return
        
        // Reload from server on error
        try {
          const res = await fetch('/api/wishlist', { credentials: 'include' })
          if (res.ok) {
            const data = await res.json()
            // ... normalization logic similar to sync ...
             const serverItems: WishlistItem[] = (data.data || []).map((item: any) => {
                const product = item.product
                const basePrice = Number(product.price)
                const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined
                const finalPrice = comparePrice && comparePrice < basePrice ? comparePrice : basePrice

                return {
                  id: product.id,
                  name: product.name,
                  price: finalPrice,
                  discountPrice: comparePrice && comparePrice < basePrice ? comparePrice : undefined,
                  image: product.images?.[0] || '',
                  slug: product.slug,
                  addedAt: item.addedAt
                }
              })
            setItems(serverItems)
          }
        } catch (err) {
          console.error('Failed to reload wishlist:', err)
        }
      }
    }).catch(error => {
      console.error('Add to wishlist failed:', error)
    })
  };

  const removeFromWishlist = (id: string) => {
    const previousItems = items
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    persistLocalWishlist(items.filter((item) => item.id !== id))

    if (!user) return

    fetch(`/api/wishlist/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(response => {
      if (!response.ok) {
        if (response.status === 401) return
        setItems(previousItems)
        persistLocalWishlist(previousItems)
      }
    }).catch(error => {
      console.error('Remove from wishlist failed:', error)
      setItems(previousItems)
      persistLocalWishlist(previousItems)
    })
  };

  const isInWishlist = (id: string) => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setItems([])
    persistLocalWishlist([])
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
