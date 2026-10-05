import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('royal_pizza_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [quickAddons, setQuickAddons] = useState(() => {
    const saved = localStorage.getItem('royal_pizza_addons');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderType, setOrderType] = useState('Delivery'); // 'Delivery' or 'Take-Away'
  const [remarks, setRemarks] = useState('');
  const [redeemWallet, setRedeemWallet] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [deliveryAddress, setDeliveryAddress] = useState('155, Patliputra Colony, Patna, Bihar, 800001, India');
  const [selectedStore, setSelectedStore] = useState('P & M Mall Outlet, Patliputra Colony, Patna');
  const [contactNumber, setContactNumber] = useState('+91 9876543210');

  useEffect(() => {
    localStorage.setItem('royal_pizza_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('royal_pizza_addons', JSON.stringify(quickAddons));
  }, [quickAddons]);

  const addToCart = (pizza, quantity = 1, crust = 'Hand Tossed', size = 'Regular', isCustom = false, customDetails = null) => {
    setCartItems((prev) => {
      // Check if item already exists
      const existingIndex = prev.findIndex(
        (item) =>
          item.name === pizza.name &&
          item.crust === crust &&
          item.size === size &&
          JSON.stringify(item.customDetails) === JSON.stringify(customDetails)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            pizzaId: pizza._id,
            name: pizza.name,
            price: pizza.price,
            image: pizza.image,
            description: pizza.description,
            quantity,
            crust,
            size,
            isCustom,
            customDetails,
          },
        ];
      }
    });
  };

  const updateQuantity = (index, delta) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const addQuickAddon = (addon) => {
    setQuickAddons((prev) => {
      const existingIndex = prev.findIndex((item) => item.name === addon.name);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { name: addon.name, price: addon.price, quantity: 1 }];
      }
    });
  };

  const updateAddonQuantity = (index, delta) => {
    setQuickAddons((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const applyCoupon = (code) => {
    if (code.toUpperCase() === 'ROYAL50') {
      setAppliedDiscount(50);
      setCouponCode('ROYAL50');
      return { success: true, message: '₹50 Coupon ROYAL50 applied successfully!' };
    } else if (code.toUpperCase() === 'FIRST100') {
      setAppliedDiscount(100);
      setCouponCode('FIRST100');
      return { success: true, message: '₹100 Coupon FIRST100 applied successfully!' };
    } else {
      return { success: false, message: 'Invalid coupon code. Try ROYAL50' };
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setQuickAddons([]);
    setRemarks('');
    setRedeemWallet(false);
    setCouponCode('');
    setAppliedDiscount(0);
  };

  // Calculations
  const itemsTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const addonsTotal = quickAddons.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subTotal = itemsTotal + addonsTotal;

  const walletPointsValue = redeemWallet ? 50 : 0;
  const totalDiscount = appliedDiscount + walletPointsValue;
  const taxableAmount = Math.max(0, subTotal - totalDiscount);
  const gst = +(taxableAmount * 0.05).toFixed(2);
  const grandTotal = +(taxableAmount + gst).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        quickAddons,
        orderType,
        setOrderType,
        remarks,
        setRemarks,
        redeemWallet,
        setRedeemWallet,
        couponCode,
        appliedDiscount,
        applyCoupon,
        deliveryAddress,
        setDeliveryAddress,
        selectedStore,
        setSelectedStore,
        contactNumber,
        setContactNumber,
        addToCart,
        updateQuantity,
        addQuickAddon,
        updateAddonQuantity,
        clearCart,
        subTotal,
        gst,
        totalDiscount,
        walletPointsValue,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
