import { ReactNode, createContext, useContext, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

type CartType = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type StateType = {
  items: CartType[];
};

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

const ShopContext = createContext(initialState);

export default function ShopContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [shoppingCart, setShoppingCart] = useState<StateType>({
    items: [],
  });

  function handleAddItemToCart(id: string) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === id
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        updatedItems.push({
          id: id,
          name: product!.title,
          price: product!.price,
          quantity: 1,
        });
      }

      return {
        items: updatedItems,
      };
    });
  }
  function handleUpdateCartItemQuantity(productId: string, amount: number) {
    setShoppingCart((prevShoppingCart) => {
      const updatedItems = [...prevShoppingCart.items];

      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        items: updatedItems,
      };
    });
  }

  return (
    <ShopContext.Provider
      value={{
        items: shoppingCart.items,
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
