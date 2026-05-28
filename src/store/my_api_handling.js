import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";


const base_url = "https://vercel-backend-tau-sooty.vercel.app";

//CategoryHandling 
export const useCategoryStore = create((set, get) => ({
  // category state
  category: [],
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  getCategory: async (e) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${base_url}/category`);
      console.log(response)
      set({ category: response.data.categories, error: null })
      console.log(response)
    }
    catch (error) {
      console.log("error fetching category", error);
      toast.error("Something went wrong");
      return false
    }
    finally { set({ loading: false }) }
  },
  getProductbyCategoryId: async (id) => {
    set(({ loading: true }));
    try {
      const response = await axios.get(`${base_url}/my_products/specific/${id}`);
      console.log(response);
      set({ products: response.data.products, error: null });


    } catch (error) {
      console.log("error fetching category", error);
      toast.error("Something went wrong");
      return false
    }
    finally {
      set({ loading: false });
    }
  },
  getProductById: async (id) => {
    set({ loading: true });
    try {
      const idx = Number(id);
      const response = await axios.get(`${base_url}/my_products/${idx}`);
      console.log(response);
      set({ products: response.data.products, error: null });

    } catch (error) {
      console.log("error fetching category", error);
      toast.error("Something went wrong");
      return false
    }
    finally {
      set({ loading: false });
    }
  }
}));


//Search Handling
export const useSearch = create((set, get) => ({
  searchResults: [],
  loading: false,
  error: null,
  currentProduct: null,

  searchQuery: "",
  setSearchQuery: (value) => set({ searchQuery: value }),

  getSearchResult: async (query) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${base_url}/my_products/search?search=${query}`);
      console.log(response);
      set({ searchResults: response.data.data, error: null });

    }
    catch (error) {
      console.log("error fetching search results", error); console.log("error fetching category", error);
      toast.error("Product not found");
      return false
    }
    finally {
      set({ loading: false });
    }
  }
}));


// Cart Handling
export const addToCart = create((set, get) => ({
  cart: [],
  loading: false,
  error: null,

  getCart: async (token) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${base_url}/cartItems`, {
        headers:{
         Authorization:`Bearer ${token}`
        },
        withCredentials: true
      });
      console.log("Response", response);
      set({ cart: response.data.data, error: null });
    }
    catch (error) {
      console.log("error fetching search results", error);
      toast.error("Product not found");
      return false;
    }
    finally { set({ loading: false }) }
  },

  cartAdd: async (id, quantity, token) => {
    set({ loading: true });
    try {
      if (!token) {
        toast.error("Please Login to add products to cart");
        return false;
      }
      else {
        const response = await axios.post(`${base_url}/cartItems`, { product_id: id, quantity: quantity }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);
        toast.success("product added to cart successfully");
        return true;
      }

    } catch (error) {
      console.log("error fetching search results", error);
      toast.error(error.response?.data?.message || "Failed to add product");
      return false
    }
    finally { set({ loading: false }) };
  },

  removeCart: async (id, token) => {
    set({ loading: true });

    try {
      if (!token) {
        toast.error("Please Login");
        return false;
      }
      else {
        const response = await axios.delete(`${base_url}/cartItems/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response);

        toast.success("product removed from cart successfully");
        return true;
      }
    } catch (error) {
      console.log("error fetching search results", error);
      toast.error(error.response?.data?.message || "Failed to add product");
      return false
    }
    finally { set({ loading: false }) }
  }
}))


export const useAddress = create((set, get) => ({
  address: [],
  orders: [],
  loading: false,
  error: null,
  getAddress: async (token) => {
    set({ loading: true });
    try {
      if (!token) {
        toast.error("please login to view your address");
        return false;
      }
      const response = await axios.get(`${base_url}/address`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response);
      set({ address: response.data.data, error: null });
      return true;
    }
    catch (error) {
      console.log("error", error);
      return false;
    }
    finally { set({ loading: false }) }
  },



  postAddress: async (token, full_name, address_line, city, state, phone_no) => {
    set({ loading: true });
    try {
      if (!token || !full_name || !address_line || !city || !state || !phone_no) return false;
      const response = await axios.post(`${base_url}/address`, {
        full_name: full_name,
        address_line: address_line,
        city: city,
        state: state,
        phone_no: phone_no,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
      const newAddress = response.data.data;

      set(state => ({
        address: [...state.address, newAddress],
        error: null
      }));
      return true;
    }
    catch (error) {
      console.log("error", error);
      return false;
    }
    finally { set({ loading: false }) }
  },
  patchAddress: async (id, token, full_name, address_line, city, state, phone_no) => {
    set({ loading: true });
    try {
      if (!id || !token || !full_name || !address_line || !city || !state || !phone_no) return false;
      const response = await axios.patch(`${base_url}/address/${id}`, {
        full_name: full_name,
        address_line: address_line,
        city: city,
        state: state,
        phone_no: phone_no,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      });
      set(state => ({
        address: state.address.map(a => a.id === id ? response.data.data : a),
        error: null
      }))
      return true;
    }
    catch (error) {
      console.log("error", error);
      return false;
    }
    finally { set({ loading: false }) }
  },
  deleteAddress: async (token, id) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`${base_url}/address/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      set(state => ({
        address: state.address.filter(addr => addr.id !== id),
        error: null
      }));
      return true;
    } catch (error) { return false }
    finally { set({ loading: false }) }
  },





  //Orders Handling

  getOrder: async (token) => {
    set({ loading: true });
    try {
      if (!token) return false;
      const response = await axios.get(`${base_url}/my_orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response);
      set({ orders: response.data.data, error: null });
    } catch (error) {
      return false;
    } finally { set({ loading: false }) }
  },
  postOrder: async (token, address_id, product_id, quantity) => {
  set({ loading: true });
  try {
    if (!token || !address_id || !product_id || !quantity) return false;

    const response = await axios.post(`${base_url}/my_orders`, {
      address_id,
      product_id,
      quantity
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });

    const newOrder = response.data.data;

    set(state => ({
      orders: [newOrder, ...state.orders],
      error: null
    }));

    return newOrder;

  } catch (error) {
    return false;
  } finally {
    set({ loading: false });
  }
},

  deleteOrder: async (token, id) => {
    set({ loading: true });
    try {
      if (!token || !id) return false;
      const idx = Number(id);
      const response = await axios.delete(`${base_url}/my_orders/${idx}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      toast.success("Order cancelled successfully")
      set(state => ({
        
        orders: state.orders.filter(order => order.id !== id),
        error: null
      }))
      return true;
    } catch (error) {
      toast.error("Can't cancel the order after 1 hour of placing it");
      return false;
    } finally { set({ loading: false }) };
  }

}))

export const useOrders = create((set, get) => ({

  loading: false,
  error: null,


}))

