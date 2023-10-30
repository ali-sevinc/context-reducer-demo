import { useRef } from "react";

import { useShopContext } from "../store/ShopContext.tsx";

import CartModal from "./CartModal.tsx";

export default function Header() {
  const { items } = useShopContext();
  const modal = useRef<HTMLDialogElement>(null);

  const cartQuantity = items.length;

  function handleOpenCartClick() {
    modal.current?.showModal();
  }

  let modalActions = <button>Close</button>;

  if (cartQuantity > 0) {
    modalActions = (
      <>
        <button>Close</button>
        <button>Checkout</button>
      </>
    );
  }

  return (
    <>
      <CartModal ref={modal} title="Your Cart" actions={modalActions} />
      <header id="main-header">
        <div id="main-title">
          <img src="logo.png" alt="Elegant model" />
          <h1>Elegant Context</h1>
        </div>
        <p>
          <button onClick={handleOpenCartClick}>Cart ({cartQuantity})</button>
        </p>
      </header>
    </>
  );
}
