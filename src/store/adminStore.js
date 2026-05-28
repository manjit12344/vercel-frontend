import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const base_url = "https://vercel-backend-tau-sooty.vercel.app/";

export const getLoggedinUser = create((set) => ({
  users: null,
  loading: false,
  error: null,

  fetchLogged: async (token) => {
    try {
      set({ loading: true });

      const response = await axios.get(
        `${base_url}/login/syncUser`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      if(response.data.user.role === "admin") toast.success("Admin logged in");
      else toast.error("Access denied: Admins only")
      set({
        users: response.data.user,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
    }
  },
}));
export const dashboardStore = create((set, get) => ({

}))


export const categoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  //

  //get all categories
  fetchCategory: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${base_url}/category`, { withCredentials: true });
      set({ categories: response.data.categories, error: null })
    }
    catch (error) {
      console.error("fetchCategories error", error);
      toast.error("Unable to load categories");
      set({ error: error.message });
    }
    finally { set({ loading: false }) };
  },

  //  post category new
  postCategory: async (cat_name, cat_image, token) => {

    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${base_url}/category`, {
        category_name: cat_name,
        category_image: cat_image
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      const newCategory = response.data;
      set(state => ({
        categories: [newCategory.category, ...state.categories]
      }))
    }
    catch (error) {
      console.error("postCategories error", error);
      toast.error("Unable to post categories");
      set({ error: error.message });
    }
    finally { set({ loading: false }) };
  },


  //update category

  updateCategory: async (id, cat_name, cat_image, token) => {

    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${base_url}/category/${id}`, {
        category_name: cat_name,
        category_image: cat_image
      },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );
      const newUpdate = response.data.category;
      set(state => ({
        categories: state.categories.map(cat => cat.category_id === id ? newUpdate : cat)
      }))
    }
    catch (error) {
      console.error("updateCategories error", error);
      toast.error("Unable to update categories");
      set({ error: error.message });
    }
    finally { set({ loading: false }) };
  },

  //delete category

  deleteCategory: async (id, token) => {

    set({ loading: true, error: null });
    try {
      const response = await axios.delete(`${base_url}/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      set(state => ({
        categories: state.categories.filter(cat => cat.category_id !== id)
      }))
    }
    catch (error) {
      console.error("deleteCategories error", error);
      toast.error("Unable to delete categories");
      set({ error: error.message });
    }
    finally { set({ loading: false }) };
  }

}))








// Product Store
export const productStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,

  pro: "",
  setPro: (value) => set({ pro: value }),
  //fetchProducts
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {

      const response = await axios.get(`${base_url}/my_products`, { withCredentials: true });
      set({ products: response.data.products, error: null });

    }
    catch (error) {
      console.error("deleteCategories error", error);
      toast.error("Unable to delete categories");
      set({ error: error.message });
    }
    finally {
      set({ loading: false })
    }
  },

  //postProducts
  postProducts: async (name, description, price, image_url, category_id, size, token) => {
    //size is an array of object having different size and stock of product
    set({ loading: true, error: null });
    try {
       const response = await axios.post(`${base_url}/my_products`,{
            name:name,
            description:description,
            price:price,
            image_url:image_url,
            category_id:category_id,
            size:size
       },{
        headers:{
          Authorization: `Bearer ${token}`
        },
        withCredentials:true
       })
       const newProduct = response.data.product
       console.log("new product:",newProduct);
     set(state =>({
       products:[newProduct,...state.products]
     }))

     }
    catch (error) {
      console.error("post product error", error);
      toast.error("Unable to post product");
      set({ error: error.message });
    }

    finally {
      set({ loading: false });
    }
  },

  //updateProducts
  updateProducts: async (id,name, description, price, image_url, category_id, size, token) => { 
     set({ loading: true, error: null });
    try {
       const response = await axios.put(`${base_url}/my_products/${id}`,{
            name:name,
            description:description,
            price:price,
            image_url:image_url,
            category_id:category_id,
            size:size
       },{
        headers:{
          Authorization: `Bearer ${token}`
        },
        withCredentials:true
       })
       set(state =>({
        products:state.products.map(prod=>(prod.id === id? response.data.products:prod))
       }))

     }
    catch (error) {
      console.error("update product error", error);
      toast.error("Unable to update product");
      set({ error: error.message });
    }

    finally {
      set({ loading: false });
    }
  },

  //deleteProducts
  deleteProducts: async (id, token) => {
    set({ loading: true, error: null });
    try {
      const response =await axios.delete(`${base_url}/my_products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      toast.success("Product deleted");
      set(state =>({
        products:state.products.filter(prod=>prod.id !== id)
      }))
    } catch (error) {
      console.error("delete product error", error);
      toast.error("Unable to delete product");
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  }

}))

export const orderStore = create((set, get) => ({

}))
export const useAdminStore = create((set, get) => ({
  categories: [],
  products: [],
  orders: [],
  users: [],
  stats: {
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
  },
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${base_url}/category`, { withCredentials: true });
      set({ categories: response.data.categories || [], error: null });
    } catch (error) {
      console.error("fetchCategories error", error);
      toast.error("Unable to load categories");
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${base_url}/my_products`, { withCredentials: true });
      set({ products: response.data.products || [], error: null });
    } catch (error) {
      console.error("fetchProducts error", error);
      toast.error("Unable to load products");
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${base_url}/orders/admin/all`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      const orders = response.data.orders || [];

      // Calculate stats
      let totalRevenue = 0;
      orders.forEach(order => {
        totalRevenue += order.total_price || 0;
      });

      set({
        orders,
        error: null,
        stats: {
          ...get().stats,
          totalOrders: orders.length,
          totalRevenue
        }
      });
    } catch (error) {
      console.error("fetchOrders error", error);
      toast.error("Unable to load orders");
      set({ error: error.message, orders: [] });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${base_url}/orders/${orderId}/status`,
        { status },
        { headers: getAuthHeaders(), withCredentials: true }
      );
      toast.success("Order status updated");
      await get().fetchOrders();
      return true;
    } catch (error) {
      console.error("updateOrderStatus error", error);
      toast.error(error.response?.data?.msg || "Failed to update order status");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createCategory: async (category) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${base_url}/category`, category, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success("Category created");
      await get().fetchCategories();
      return true;
    } catch (error) {
      console.error("createCategory error", error);
      toast.error(error.response?.data?.msg || "Failed to create category");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, category) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`${base_url}/category/${id}`, category, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success("Category updated");
      await get().fetchCategories();
      return true;
    } catch (error) {
      console.error("updateCategory error", error);
      toast.error(error.response?.data?.msg || "Failed to update category");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${base_url}/category/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success("Category deleted");
      await get().fetchCategories();
      return true;
    } catch (error) {
      console.error("deleteCategory error", error);
      toast.error(error.response?.data?.msg || "Failed to delete category");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (product) => {
    set({ loading: true, error: null });
    try {
      await axios.post(`${base_url}/my_products`, product, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success("Product created");
      await get().fetchProducts();
      return true;
    } catch (error) {
      console.error("createProduct error", error);
      toast.error(error.response?.data?.msg || "Failed to create product");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null });
    try {
      await axios.put(`${base_url}/my_products/${id}`, product, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success("Product updated");
      await get().fetchProducts();
      return true;
    } catch (error) {
      console.error("updateProduct error", error);
      toast.error(error.response?.data?.msg || "Failed to update product");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${base_url}/my_products/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      toast.success("Product deleted");
      await get().fetchProducts();
      return true;
    } catch (error) {
      console.error("deleteProduct error", error);
      toast.error(error.response?.data?.msg || "Failed to delete product");
      set({ error: error.message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));