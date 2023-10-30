import Header from "./components/Header.tsx";
import Shop from "./components/Shop.tsx";
import ShopContextProvider from "./store/ShopContext.tsx";

function App() {
  return (
    <ShopContextProvider>
      <Header />
      <Shop />
    </ShopContextProvider>
  );
}

export default App;
