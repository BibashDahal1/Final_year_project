import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseurl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://g4xllfkx-8000.inc1.devtunnels.ms";

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // Store token in localStorage
      if (data.token || data.access_token) {
        localStorage.setItem("authToken", data.token || data.access_token);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      console.log("Sending OTP verification:", otpData); // Debug log

      const response = await fetch(`${baseurl}/api/auth/verify-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();
      console.log("OTP verification response:", data); // Debug log

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // Store token in localStorage if provided
      if (data.token || data.access_token) {
        localStorage.setItem("authToken", data.token || data.access_token);
      }

      return data;
    } catch (error) {
      console.error("OTP verification error:", error); // Debug log
      return rejectWithValue({ message: error.message });
    }
  }
);

// Async thunk for Google login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (tokenData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/google-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tokenData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      // Store token in localStorage
      if (data.token || data.access_token) {
        localStorage.setItem("authToken", data.token || data.access_token);
      }

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
  signupSuccess: false,
  otpVerified: false,
  signupEmail: null, // Store email for OTP verification
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.signupSuccess = false;
      state.otpVerified = false;
      state.signupEmail = null;
      localStorage.removeItem("authToken");
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSignupSuccess: (state) => {
      state.signupSuccess = false;
    },
    resetOtpVerified: (state) => {
      state.otpVerified = false;
    },
  },
  extraReducers: (builder) => {
    // Signup cases
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.signupSuccess = true;
        state.user = action.payload.user || null;
        // Store email for OTP verification
        state.signupEmail =
          action.payload.email || action.payload.user?.email || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || action.payload?.error || "Signup failed";
        state.signupSuccess = false;
      });

    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.token =
          action.payload.token || action.payload.access_token || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || action.payload?.error || "Login failed";
        state.isAuthenticated = false;
      });

    // OTP verification cases
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpVerified = true;
        if (action.payload.token || action.payload.access_token) {
          state.isAuthenticated = true;
          state.token = action.payload.token || action.payload.access_token;
          localStorage.setItem(
            "authToken",
            action.payload.token || action.payload.access_token
          );
        }
        // Update user data if provided
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "OTP verification failed";
        state.otpVerified = false;
      });

    // Google login cases
    builder
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        state.token =
          action.payload.token || action.payload.access_token || null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Google login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, resetSignupSuccess, resetOtpVerified } =
  authSlice.actions;

export default authSlice.reducer;
