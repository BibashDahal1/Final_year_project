import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseurl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://c7fv7c2b-8000.inc1.devtunnels.ms/";

// Helper: extract access token from any response shape
const extractTokens = (data) => ({
  access: data.access || data.token || data.access_token || null,
  refresh: data.refresh || data.refresh_token || null,
});

// Helper: persist tokens
const saveTokens = (access, refresh) => {
  if (access) localStorage.setItem("authToken", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

// Async thunk for user signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      const { access, refresh } = extractTokens(data);
      saveTokens(access, refresh);

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otpData),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      const { access, refresh } = extractTokens(data);
      saveTokens(access, refresh);

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

// Async thunk for Google login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (tokenData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/auth/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tokenData),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);

      const { access, refresh } = extractTokens(data);
      saveTokens(access, refresh);

      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

// Initial state — rehydrate from localStorage on every page load/tab switch
const storedToken = localStorage.getItem("authToken");

const initialState = {
  user: null,
  token: storedToken || null,
  isAuthenticated: !!storedToken, // ← stays true across tab switches
  isLoading: false,
  error: null,
  signupSuccess: false,
  otpVerified: false,
  signupEmail: null,
};

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
      localStorage.removeItem("refreshToken");
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
    // ── Signup ──────────────────────────────────────────────────────────────
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
        state.signupEmail =
          action.payload.email || action.payload.user?.email || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.signupSuccess = false;
        state.error =
          action.payload?.message || action.payload?.error || "Signup failed";
      });

    // ── Login ───────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user || null;
        // Support all three token field names the API might return
        state.token =
          action.payload.access ||
          action.payload.token ||
          action.payload.access_token ||
          null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error =
          action.payload?.message || action.payload?.error || "Login failed";
      });

    // ── OTP Verification ────────────────────────────────────────────────────
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otpVerified = true;
        state.signupSuccess = false; // clear so OTP modal doesn't re-open

        const access =
          action.payload.access ||
          action.payload.token ||
          action.payload.access_token ||
          null;

        if (access) {
          state.isAuthenticated = true;
          state.token = access;
        }

        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.otpVerified = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "OTP verification failed";
      });

    // ── Google Login ─────────────────────────────────────────────────────────
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
          action.payload.access ||
          action.payload.token ||
          action.payload.access_token ||
          null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error =
          action.payload?.message ||
          action.payload?.error ||
          "Google login failed";
      });
  },
});

export const { logout, clearError, resetSignupSuccess, resetOtpVerified } =
  authSlice.actions;

export default authSlice.reducer;
