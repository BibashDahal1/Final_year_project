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

// Async thunk for OCR extraction
export const extractOCR = createAsyncThunk(
  "ocr/extract",
  async ({ image, language }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("language", language);

      const response = await fetch(`${baseurl}/api/ocr/extract/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
          // No Content-Type header — let browser set multipart boundary
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

export const translateText = createAsyncThunk(
  "translation/translate",
  async ({ text, direction }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/translation/translate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ text, direction }),
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

export const ocrTranslate = createAsyncThunk(
  "ocr/ocrTranslate",
  async ({ image, language }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("language", language);

      const response = await fetch(`${baseurl}/api/ocr/ocr-translate/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

export const fetchTranslationHistory = createAsyncThunk(
  "translation/history",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/translation/history/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue({ message: error.message });
    }
  },
);

export const fetchOcrTranslateHistory = createAsyncThunk(
  "ocr/translateHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${baseurl}/api/ocr/translate-history/`, {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
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

  ocrResult: null,
  ocrLoading: false,
  ocrError: null,

  // Translation
  translationResult: null,
  translationLoading: false,
  translationError: null,

  // OCR Translate
  ocrTranslateResult: null,
  ocrTranslateLoading: false,
  ocrTranslateError: null,

  translationHistory: [],
  translationHistoryLoading: false,
  translationHistoryError: null,

  ocrTranslateHistory: [],
  ocrTranslateHistoryLoading: false,
  ocrTranslateHistoryError: null,
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
      state.translationHistory = [];
      state.translationHistoryLoading = false;
      state.translationHistoryError = null;
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
    resetOcrResult: (state) => {
      state.ocrResult = null;
      state.ocrError = null;
    },
    resetTranslationResult: (state) => {
      state.translationResult = null;
      state.translationError = null;
    },
    resetOcrTranslateResult: (state) => {
      state.ocrTranslateResult = null;
      state.ocrTranslateError = null;
    },
    clearTranslationHistory: (state) => {
      state.translationHistory = [];
      state.translationHistoryError = null;
    },
    clearOcrTranslateHistory: (state) => {
      state.ocrTranslateHistory = [];
      state.ocrTranslateHistoryError = null;
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

    builder
      .addCase(extractOCR.pending, (state) => {
        state.ocrLoading = true;
        state.ocrError = null;
        state.ocrResult = null;
      })
      .addCase(extractOCR.fulfilled, (state, action) => {
        state.ocrLoading = false;
        state.ocrResult = action.payload;
      })
      .addCase(extractOCR.rejected, (state, action) => {
        state.ocrLoading = false;
        state.ocrError =
          action.payload?.message ||
          action.payload?.error ||
          "OCR extraction failed";
      });

    // Translation
    builder
      .addCase(translateText.pending, (state) => {
        state.translationLoading = true;
        state.translationError = null;
        state.translationResult = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.translationLoading = false;
        state.translationResult = action.payload;
      })
      .addCase(translateText.rejected, (state, action) => {
        state.translationLoading = false;
        state.translationError =
          action.payload?.message ||
          action.payload?.error ||
          "Translation failed";
      });

    // OCR Translate
    builder
      .addCase(ocrTranslate.pending, (state) => {
        state.ocrTranslateLoading = true;
        state.ocrTranslateError = null;
        state.ocrTranslateResult = null;
      })
      .addCase(ocrTranslate.fulfilled, (state, action) => {
        state.ocrTranslateLoading = false;
        state.ocrTranslateResult = action.payload;
      })
      .addCase(ocrTranslate.rejected, (state, action) => {
        state.ocrTranslateLoading = false;
        state.ocrTranslateError =
          action.payload?.message ||
          action.payload?.error ||
          "OCR translation failed";
      });

    builder
      .addCase(fetchTranslationHistory.pending, (state) => {
        state.translationHistoryLoading = true;
        state.translationHistoryError = null;
      })
      .addCase(fetchTranslationHistory.fulfilled, (state, action) => {
        state.translationHistoryLoading = false;
        state.translationHistory = action.payload;
      })
      .addCase(fetchTranslationHistory.rejected, (state, action) => {
        state.translationHistoryLoading = false;
        state.translationHistoryError =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch translation history";
      });

    builder
      .addCase(fetchOcrTranslateHistory.pending, (state) => {
        state.ocrTranslateHistoryLoading = true;
        state.ocrTranslateHistoryError = null;
      })
      .addCase(fetchOcrTranslateHistory.fulfilled, (state, action) => {
        state.ocrTranslateHistoryLoading = false;
        state.ocrTranslateHistory = action.payload;
      })
      .addCase(fetchOcrTranslateHistory.rejected, (state, action) => {
        state.ocrTranslateHistoryLoading = false;
        state.ocrTranslateHistoryError =
          action.payload?.message ||
          action.payload?.error ||
          "Failed to fetch OCR translate history";
      });
  },
});

export const {
  logout,
  clearError,
  resetSignupSuccess,
  resetOtpVerified,
  resetOcrResult,
  resetTranslationResult,
  resetOcrTranslateResult,
  clearTranslationHistory,
  clearOcrTranslateHistory,
} = authSlice.actions;

export default authSlice.reducer;
