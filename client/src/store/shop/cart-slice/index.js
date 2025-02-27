import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  cartItems: [],
  isLoading: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, selectedModels }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
      {
        userId,
        productId,
        quantity,
        selectedModels,
      }
    );

    return response.data;
  }
);

export const syncCartToBackend = createAsyncThunk(
  "cart/syncCart",
  async (userId, { rejectWithValue }) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];

      if (localCart.length === 0) return { success: true };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/sync`,
        {
          userId,
          items: localCart,
        }
      );

      localStorage.removeItem("cart");

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to sync cart");
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { getState }) => {
    const { isAuthenticated } = getState().auth; // Get auth state

    if (!isAuthenticated) {
      // Guest User - Fetch from localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      return { success: true, data: localCart };
    }

    // Logged-in User - Fetch from Backend
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId}`
    );
    return response.data;
  }
);

export const fetchGuestCartDetails = createAsyncThunk(
  "cart/fetchGuestCartDetails",
  async (cartItems, { rejectWithValue }) => {
    try {
      if (!cartItems.length) {
        // ✅ Clear guest cart when empty
        return []; // ✅ Stop execution, no API call
      }
      const productIds = cartItems.map((item) => item.productId);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/products`,
        { productIds }
      );

      // Merge product details into cart items
      return cartItems.map((item) => {
        const product = response.data.find((p) => p._id === item.productId);
        return product ? { ...item, ...product } : item;
      });
    } catch (error) {
      console.error("Error fetching guest cart details:", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch cart data"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId}/${productId}`
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []; // Reset cart when user logs out
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(syncCartToBackend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(syncCartToBackend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data || []; // Ensure data exists
      })
      .addCase(syncCartToBackend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error syncing cart";
      })
      .addCase(fetchGuestCartDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuestCartDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload; // Store fetched cart details
      })
      .addCase(fetchGuestCartDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Error fetching cart details";
      });
  },
});

export const { clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
