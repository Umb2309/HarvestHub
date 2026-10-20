import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

// v2: prices moved to Naira — the new key ignores old dollar-priced carts
const STORAGE_KEY = 'harvesthub_cart_v2';

// ── Reducer ────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    default:
      return state;
  }
}

// ── Provider ───────────────────────────────────────────────
/** Reads the saved cart once, before the first render */
function loadInitialCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items = stored ? JSON.parse(stored) : [];
    return { items: Array.isArray(items) ? items : [] };
  } catch {
    return { items: [] };
  }
}

export function CartProvider({ children }) {
  // 🎓 The third argument to useReducer is a lazy initialiser: it runs once,
  // so the saved cart is in state from the very first render. Loading it in a
  // useEffect instead lets the "save" effect overwrite storage with [] first.
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage full or blocked (private mode) — the cart still works in memory
    }
  }, [state.items]);

  // Derived values
  // Cart count = total units across all items
  const cartCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem    = (product) => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem = (id)      => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQty  = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart  = ()        => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        cartCount,
        cartTotal,
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

