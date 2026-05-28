import Login from './components/Login'
import NavBar from "./components/NavBar";
import {Routes, Route} from "react-router-dom";
import Cart from "./pages/Cart";
import Home from "./pages/home";
import Category from "./pages/Category"
import {Toaster} from "react-hot-toast";
import Products from "./pages/Products"
import SearchProduct from './pages/SearchProducts';
import Admin from "./pages/Admin";
import OrderItem from "./pages/Order-item";
import OrderHistory from "./pages/Order-history";
function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/category/:id" element={<Products />} />
        <Route path="/search" element={<SearchProduct/>}/>
        <Route path="/category" element = {<Category/>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/product/:id" element={<OrderItem />} />
        
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;