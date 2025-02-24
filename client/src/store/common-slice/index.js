import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  isContactSubmitting: false,
  isContactSuccess: false,
  isContactError: false,
  inquiries: [],
};

export const getInquiries = createAsyncThunk(
  "/contact/getInquiries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/contact/get`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch inquiries"
      );
    }
  }
);

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/feature/get`
    );

    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
      { image }
    );

    return response.data;
  }
);

export const removeFeatureImages = createAsyncThunk(
  "/order/removeFeatureImage",
  async (imageId) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/common/feature/${imageId}`
    );

    return response.data;
  }
);

export const submitContactForm = createAsyncThunk(
  "/contact/submitContactForm",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact/submit`,
        formData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(submitContactForm.pending, (state) => {
        state.isContactSubmitting = true;
        state.isContactSuccess = false;
        state.isContactError = false;
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.isContactSubmitting = false;
        state.isContactSuccess = true;
        state.isContactError = false;
      })
      .addCase(submitContactForm.rejected, (state) => {
        state.isContactSubmitting = false;
        state.isContactSuccess = false;
        state.isContactError = true;
      })
      .addCase(getInquiries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getInquiries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.inquiries = action.payload;
      })
      .addCase(getInquiries.rejected, (state) => {
        state.isLoading = false;
        state.inquiries = [];
      });
  },
});

export default commonSlice.reducer;
