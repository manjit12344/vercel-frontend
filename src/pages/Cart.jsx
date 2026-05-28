import React, { useEffect } from 'react'
import CartCard from "../components/cart.jsx";
import { addToCart } from '../store/my_api_handling';
import {useAuth} from "@clerk/clerk-react"
const Carts = () => {
  const {getToken} = useAuth();
  const { cart, loading, getCart,removeCart, error } = addToCart();

  useEffect(() => {
    async function see(){
      const token = await getToken();
      getCart(token);
    }
    see();
  }, []);
   console.log("Cart",cart);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error}</p>;
  if (!Array.isArray(cart) || cart.length === 0) {
    return <p>No data found</p>;
  }

  return (
    <div className="row g-0">
      {cart.map((p) => (
        <div
          key={p.id}
          className="col-6 p-1 col-md-4 mb-4 d-flex justify-content-center"
        >
          <div style={{ maxWidth: "350px", width: "100%" }}>
            <CartCard product={p} removeCart = {removeCart}/>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carts;