/* eslint-disable no-case-declarations */
import { ReactNode, createContext, useContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

type InitialType = {
  items: { id: string; name: string; price: number; quantity: number }[];
  addItemToCart: (id: string) => void;
  updateItemFromCart: (productId: string, amount: number) => void;
};

const initialState: InitialType = {
  items: [],
  addItemToCart: () => {},
  updateItemFromCart: () => {},
};

type ReducerStateType = {
  items: { id: string; name: string; price: number; quantity: number }[];
};
type ActionType = {
  type: "add-item" | "update-item";
  payload: { id?: string; productId?: string; amount?: number };
};

const ShopContext = createContext(initialState);

function shopReducer(state: ReducerStateType, action: ActionType) {
  const updatedItems = [...state.items];
  switch (action.type) {
    case "add-item":
      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload.id!
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find(
          (product) => product.id === action.payload.id
        );
        updatedItems.push({
          id: action.payload.id!,
          name: product!.title,
          price: product!.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    case "update-item":
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === action.payload.productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += action.payload.amount!;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };

    default:
      return initialState;
  }
}

export default function ShopContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(shopReducer, initialState);
  const { items } = state;

  function handleAddItemToCart(id: string) {
    dispatch({ type: "add-item", payload: { id } });
  }
  function handleUpdateCartItemQuantity(productId: string, amount: number) {
    dispatch({ type: "update-item", payload: { productId, amount } });
  }

  return (
    <ShopContext.Provider
      value={{
        items: items,
        addItemToCart: handleAddItemToCart,
        updateItemFromCart: handleUpdateCartItemQuantity,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useShopContext() {
  const context = useContext(ShopContext);
  return context;
}
