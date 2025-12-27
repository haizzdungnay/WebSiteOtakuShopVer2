'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  const storageAvailable = () => {
    try {
      const testKey = '__cart_test__'
      window.localStorage.setItem(testKey, testKey)
      window.localStorage.removeItem(testKey)
      return true
    } catch (error) {
      console.error('LocalStorage unavailable:', error)
      return false
    }
  }

  const readLocalCart = (): CartItem[] => {
    if (typeof window === 'undefined' || !storageAvailable()) return []

    const savedCart = window.localStorage.getItem('cart')
    if (!savedCart) return []

    try {
      return JSON.parse(savedCart)
    } catch (error) {
      console.error('Error parsing local cart:', error)
      return []
    }
  }

  const persistLocalCart = (cartItems: CartItem[]) => {
    if (typeof window === 'undefined' || !storageAvailable()) return

    try {
      window.localStorage.setItem('cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  // Load cart from localStorage on mount - CLIENT SIDE ONLY
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setItems(readLocalCart());
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes - CLIENT SIDE ONLY
  // Now saves for ALL users as backup
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      persistLocalCart(items);
    }
  }, [items, isLoaded]);

  // Sync server cart when user changes
  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      setItems(readLocalCart())
      return
    }

    const syncCart = async () => {
      const localItems = readLocalCart()

      // Try to sync local items to server
      if (localItems.length > 0) {
        for (const item of localItems) {
          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ productId: item.id, quantity: item.quantity })
            })
            // If we get 401, stop syncing - auth is invalid
            if (response.status === 401) {
              console.warn('Auth invalid during cart sync - keeping local cart')
              setItems(localItems)
              return
            }
          } catch (error) {
            console.error('Sync cart error:', error)
          }
        }
      }

      try {
        const response = await fetch('/api/cart', { credentials: 'include' })
        
        // If 401, keep local cart
        if (response.status === 401) {
          console.warn('Auth invalid - keeping local cart')
          const local = readLocalCart()
          if (local.length > 0) {
            setItems(local)
          }
          return
        }
        
        if (response.ok) {
          const data = await response.json()
          const serverItems: CartItem[] = (data.data?.items || []).map((item: any) => {
            const basePrice = Number(item.product.price)
            const comparePrice = item.product.comparePrice ? Number(item.product.comparePrice) : undefined
            const finalPrice = comparePrice && comparePrice < basePrice ? comparePrice : basePrice

            return {
              id: item.product.id,
              name: item.product.name,
              price: finalPrice,
              discountPrice: comparePrice && comparePrice < basePrice ? comparePrice : undefined,
              image: item.product.images?.[0] || '',
              quantity: item.quantity,
              slug: item.product.slug,
            }
          })
          
          // If server cart is empty but we have local items, keep local
          if (serverItems.length === 0 && localItems.length > 0) {
            setItems(localItems)
          } else {
            setItems(serverItems)
            // Clear local cart after successful server sync
            if (serverItems.length > 0) {
              persistLocalCart([])
            }
          }
        }
      } catch (error) {
        console.error('Failed to load cart from server:', error)
        // On error, keep local cart
        const local = readLocalCart()
        if (local.length > 0) {
          setItems(local)
        }
      }
    }

    syncCart()
  }, [user, isLoaded])

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const optimisticUpdate = (prevItems: CartItem[]) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prevItems, { ...item, quantity }]
    }

    // Apply optimistic update
    setItems((prevItems) => {
      const newItems = optimisticUpdate(prevItems)
      // Always persist to localStorage as backup
      persistLocalCart(newItems)
      return newItems
    })

    if (!user) {
      return
    }

    fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId: item.id, quantity })
    }).then(async response => {
      if (!response.ok) {
        // If 401 (unauthorized), the token is invalid - keep optimistic update in localStorage
        // Don't reload from server as it will return empty cart
        if (response.status === 401) {
          console.warn('Cart API returned 401 - keeping local cart')
          return
        }
        
        // For other errors, try to reload from server
        try {
          const cartResponse = await fetch('/api/cart', { credentials: 'include' })
          if (cartResponse.ok) {
            const data = await cartResponse.json()
            const normalizedItems: CartItem[] = (data.data?.items || []).map((cartItem: any) => {
              const basePrice = Number(cartItem.product.price)
              const comparePrice = cartItem.product.comparePrice ? Number(cartItem.product.comparePrice) : undefined
              const finalPrice = comparePrice && comparePrice < basePrice ? comparePrice : basePrice

              return {
                id: cartItem.product.id,
                name: cartItem.product.name,
                price: finalPrice,
                discountPrice: comparePrice && comparePrice < basePrice ? comparePrice : undefined,
                image: cartItem.product.images?.[0] || '',
                quantity: cartItem.quantity,
                slug: cartItem.product.slug,
              }
            })
            setItems(normalizedItems)
          }
        } catch (err) {
          console.error('Failed to reload cart:', err)
        }
        return
      }

      const data = await response.json()
      const product = data.data?.product
      if (product) {
        const basePrice = Number(product.price)
        const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined
        const finalPrice = comparePrice && comparePrice < basePrice ? comparePrice : basePrice

        setItems((current) => current.map((cartItem) => cartItem.id === product.id ? {
          id: product.id,
          name: product.name,
          price: finalPrice,
          discountPrice: comparePrice && comparePrice < basePrice ? comparePrice : undefined,
          image: product.images?.[0] || item.image,
          quantity: data.data.quantity,
          slug: product.slug,
        } : cartItem))
      }
    }).catch(error => {
      console.error('Add to cart failed:', error)
      // On network error, keep optimistic update (already saved to localStorage)
    })
  };

  const removeFromCart = (id: string) => {
    const previousItems = items
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id)
      persistLocalCart(newItems)
      return newItems
    })

    if (!user) return

    fetch(`/api/cart/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(response => {
      if (!response.ok && response.status !== 401) {
        setItems(previousItems)
        persistLocalCart(previousItems)
      }
    }).catch(error => {
      console.error('Remove from cart failed:', error)
      setItems(previousItems)
      persistLocalCart(previousItems)
    })
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }

    const previousItems = items
    setItems((prevItems) => {
      const newItems = prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      persistLocalCart(newItems)
      return newItems
    })

    if (!user) return

    fetch(`/api/cart/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    }).then(response => {
      if (!response.ok && response.status !== 401) {
        setItems(previousItems)
        persistLocalCart(previousItems)
      }
    }).catch(error => {
      console.error('Update quantity failed:', error)
      setItems(previousItems)
      persistLocalCart(previousItems)
    })
  };

  const clearCart = () => {
    setItems([])
    persistLocalCart([])

    if (!user) return

    fetch('/api/cart', {
      method: 'DELETE',
      credentials: 'include'
    }).catch(error => console.error('Clear cart failed:', error))
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.discountPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
