import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('elexo_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to load cart from storage:", e);
      return [];
    }
  });

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elexo_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cart to storage:", e);
    }
  }, [cartItems]);

  const addItemToCart = (product, variantIndex = 0, quantity = 1) => {
    setCartItems((prev) => {
      const variant = product.variants?.[variantIndex] || { variant_name: 'Default' };
      const productId = product.product_id || product.id;
      const variantKey = `${productId}-${variant.variant_name}`;
      const existingIdx = prev.findIndex((item) => item.variantKey === variantKey);

      // Extract safest price format
      const itemPrice = parseFloat(product.base_price || product.price || 0);

      // Extract safest image format
      const primaryImage = product.image_url || product.main_image_url || product.images?.[0]?.image_url || product.images?.[0] || product.imageUrl || '/assets/product-BICEL6TG.png';

      if (existingIdx !== -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += parseInt(quantity, 10) || 1;
        return updated;
      }

      return [
        ...prev,
        {
          product_id: productId,
          variantKey,
          name: product.name || 'Elexoplus Appliance',
          category: product.category_name || product.category || 'General',
          base_price: itemPrice,
          price: itemPrice,
          image_url: primaryImage,
          imageUrl: primaryImage,
          variant_name: variant.variant_name || 'Standard',
          quantity: parseInt(quantity, 10) || 1
        }
      ];
    });
  };

  const addToCart = (product, quantity = 1) => {
    addItemToCart(product, 0, quantity);
  };

  const removeItem = (variantKey) => {
    setCartItems((prev) => prev.filter((item) => item.variantKey !== variantKey));
  };

  const updateQuantity = (variantKey, quantity) => {
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      removeItem(variantKey);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.variantKey === variantKey ? { ...item, quantity: parsedQty } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, addToCart, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};