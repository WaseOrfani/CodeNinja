import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('oria-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('oria-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, variant, extras = [], quantity = 1) => {
    const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
    const itemTotal = (variant.price + extrasTotal) * quantity;
    
    const newItem = {
      id: `${product.id}-${variant.name}-${extras.map(e => e.id).join('-')}-${Date.now()}`,
      product_id: product.id,
      product_name: product.name,
      product_image: product.image,
      variant: variant.name,
      variant_price: variant.price,
      variant_includes: variant.includes || null,
      extras: extras,
      quantity: quantity,
      total: itemTotal
    };
    
    setItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeItem = (itemId) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const extrasTotal = item.extras.reduce((sum, e) => sum + e.price, 0);
        return {
          ...item,
          quantity: newQuantity,
          total: (item.variant_price + extrasTotal) * newQuantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('oria-cart');
  };

  const cartTotal = items.reduce((sum, item) => sum + item.total, 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
