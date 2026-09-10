import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (product, variantIndex, quantity) => {
    setCartItems((prev) => {
      const variant = product.variants?.[variantIndex] || { variant_name: 'Default' };
      const variantKey = `${product.product_id || product.id}-${variant.variant_name}`;
      const existingIdx = prev.findIndex((item) => item.variantKey === variantKey);

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          id: product.product_id || product.id,
          variantKey,
          name: product.name,
          category: product.category_name || product.category,
          price: product.price,
          imageUrl: product.main_image_url || product.images?.[0] || product.imageUrl || '',
          variant_name: variant.variant_name,
          quantity
        }
      ];
    });
  };

  const removeItem = (variantKey) => {
    setCartItems((prev) => prev.filter((item) => item.variantKey !== variantKey));
  };

  const updateQuantity = (variantKey, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => (item.variantKey === variantKey ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
