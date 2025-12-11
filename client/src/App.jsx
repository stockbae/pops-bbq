import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EmployeeMenu from "./pages/EmployeeMenu";
import EmployeeOrders from "./pages/EmployeeOrders";
import Checkout from "./pages/Checkout";
import { useState } from "react";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  // Global order state 
  const [order, setOrder] = useState([]);

  function changeQuantity(quantity, index) {
    setOrder(
      order.map((o, oIndex) => {
        if (oIndex === index) {
          return { ...o, quantity: Number(quantity) };
        }
        return o;
      })
    );
  }

  function removeFromOrder(index) {
    setOrder(order.filter((_, oIndex) => oIndex !== index));
  }

  //CONSOLIDATE DUPLICATE ITEMS
  function consolidateOrder(expandedOrder) {
    let consolidatedItems = [];
    expandedOrder.forEach((item) => {
      let count = 0;
      expandedOrder.forEach((orderItem) => {
        // Count duplicates
        if (orderItem.id === item.id) {
          if (orderItem.chosenMeats.length > 0 || orderItem.chosenSides.length > 0) {
            // Check if chosen options are the same
            if (JSON.stringify(orderItem.chosenMeats.sort()) === JSON.stringify(item.chosenMeats.sort()) && JSON.stringify(orderItem.chosenSides.sort()) === JSON.stringify(item.chosenSides.sort())) {
              count++;
            }
          }
          else {
            //No meats or sides, just id duplicates
            count++;
          }
        }
      });
      if (count == 1) {
        consolidatedItems.push(item);
      } else if (count > 1) {
        // Avoid adding duplicates
        if (consolidatedItems.map((i) => i.id).includes(item.id)) return;
        item.quantity = count;
        setOrder(expandedOrder.filter((i) => i.id !== item.id));
        consolidatedItems.push(item);
      }
    });
    setOrder(consolidatedItems);
  };



  return (
    <BrowserRouter>
      <Routes>
        {/* HOME now receives order + ability to update it */}
        <Route path="/" element={<Home order={order} setOrder={setOrder} consolidateOrder={consolidateOrder} />} />

        {/* EMPLOYEE MENU stays untouched for now */}
        <Route path="/employee-menu" element={<EmployeeMenu />} />

        {/* EMPLOYEE ORDERS - view pending orders */}
        <Route path="/employee-orders" element={<EmployeeOrders />} />

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
