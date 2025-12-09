import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmployeeMenu from "./pages/EmployeeMenu";
import Checkout from "./pages/Checkout";
import { useState } from "react";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  // Global order state 
  const [order, setOrder] = useState([]);

  function changeQuantity(item, quantity) {
    setOrder(
      order.map((o) => {
        if (o.name === item.name) {
          return { ...o, quantity: Number(quantity) };
        }
        return o;
      })
    );
  }

  function removeFromOrder(item) {
    setOrder(order.filter((o) => o.name !== item.name));
  }



  return (
    <BrowserRouter>
      <Routes>
        {/* HOME now receives order + ability to update it */}
        <Route path="/" element={<Home order={order} setOrder={setOrder} />} />

        {/* EMPLOYEE MENU stays untouched for now */}
        <Route path="/employee-menu" element={<EmployeeMenu />} />

        {/* CHECKOUT receives the same global order */}
        <Route
          path="/checkout"
          element={
            <Checkout
              order={order}
              changeQuantity={changeQuantity}
              removeFromOrder={removeFromOrder}
            />
          }
        />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
