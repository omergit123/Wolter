import { createContext, useState, useContext, useEffect } from "react";
import { useAuthorization } from "./AuthorizationContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const { userId, loadingUser } = useAuthorization();
    const [cart, setCart] = useState([]);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    const getStorageKey = (uid) =>
        uid ? `wolter_cart_${uid}` : "wolter_cart_guest";

    useEffect(() => {
        if (loadingUser) return;

        try {
            const userKey = getStorageKey(userId);
            const guestKey = getStorageKey(null);

            const userCartRaw = localStorage.getItem(userKey);
            const userCart = userCartRaw ? JSON.parse(userCartRaw) : [];

            if (userId) {
                const guestCartRaw = localStorage.getItem(guestKey);
                const guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];

                if (guestCart.length > 0) {
                    const merged = [...userCart];
                    for (const gItem of guestCart) {
                        const idx = merged.findIndex(
                            (i) =>
                                i.productId === gItem.productId &&
                                i.restaurantId === gItem.restaurantId,
                        );
                        if (idx > -1) {
                            merged[idx] = {
                                ...merged[idx],
                                amount: merged[idx].amount + gItem.amount,
                            };
                        } else {
                            merged.push(gItem);
                        }
                    }
                    setCart(merged);
                    localStorage.setItem(userKey, JSON.stringify(merged));
                    localStorage.removeItem(guestKey);
                    setIsCartLoaded(true);
                    return;
                }
            }

            setCart(userCart);
            setIsCartLoaded(true);
        } catch (error) {
            console.error("Failed to load cart for user change:", error);
            setIsCartLoaded(true);
        }
    }, [userId, loadingUser]);

    useEffect(() => {
        if (loadingUser || !isCartLoaded) return;

        try {
            const key = getStorageKey(userId);
            localStorage.setItem(key, JSON.stringify(cart));
        } catch (error) {
            console.error("Failed to persist cart to localStorage:", error);
        }
    }, [cart, userId, loadingUser, isCartLoaded]);

    // Adding an item to the cart.
    const addItem = (item, amount) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (i) =>
                    i.productId === item.productId &&
                    i.restaurantId === item.restaurantId,
            );
            if (existingIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    amount: newCart[existingIndex].amount + amount,
                };
                return newCart;
            } else {
                return [...prevCart, { ...item, amount: amount }];
            }
        });
    };

    // removing one item of a product
    const removeItem = (productId) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (i) => i.productId === productId,
            );
            if (existingIndex === -1) return prevCart;

            const currentAmount = prevCart[existingIndex].amount;
            if (currentAmount > 1) {
                const newCart = [...prevCart];
                newCart[existingIndex] = {
                    ...newCart[existingIndex],
                    amount: currentAmount - 1,
                };
                return newCart;
            } else {
                return prevCart.filter((i) => i.productId !== productId);
            }
        });
    };

    // Remove any items of a product
    const removeProduct = (productId) => {
        setCart((prevCart) =>
            prevCart.filter((i) => i.productId !== productId),
        );
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.amount, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addItem,
                removeItem,
                removeProduct,
                clearCart,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
