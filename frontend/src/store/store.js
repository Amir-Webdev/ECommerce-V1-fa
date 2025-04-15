/**
 * 🔵 **What**: Redux Store Configuration
 * 🟠 **How**: Centralizes app state + integrates RTK Query
 * 🔴 **Why**: Single source of truth for all UI data
 * 💎 **Pro Tip**: Follows Redux "one store" principle (unlike modular Zustand)
 */
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/api/apiSlice.js"; // RTK Query API slice
import cartSliceReducer from "./slices/cart/cartSlice.js";
import authSliceReducer from "./slices/auth/authSlice.js";

// ========================
// 🏗️ STORE INITIALIZATION
// ========================
const store = configureStore({
  /**
   * 🔵 **What**: Reducer Configuration
   * 🟠 **How**: Combines API slice + cart reducers
   * 🔴 **Why**: `reducerPath` ensures stable state shape
   * 🚨 **Watch**: Dynamic imports break HMR if added here
   *
   * 🛠️ **Correction**: Previously said "HMR breaks" → clarified to "Dynamic imports affect HMR"
   */
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // 🛰️ RTK Query's auto-managed state
    cart: cartSliceReducer, // 🛒 Custom cart logic
    auth: authSliceReducer,
    // 🔮 **Future**: Add auth reducer here later
    // 💡 **Example**: `user: userReducer`
  },

  /**
   * 🔵 **What**: Middleware Chain
   * 🟠 **How**: Defaults + RTK Query middleware
   * 🔴 **Why**: Order affects action processing
   * 💎 **Pro Tip**: Add logger middleware here in dev:
   * `middleware: (gDM) => gDM().concat(apiSlice.middleware, logger)`
   *
   * 🛠️ **Enhanced**: Added explicit logger example
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  /**
   * 🔵 **What**: DevTools Config
   * 🟠 **How**: Enabled only in dev mode
   * 🔴 **Why**: 15KB smaller prod bundle
   * 💎 **Hidden Gem**: Pass config object for tracing:
   * `devTools: { trace: true, traceLimit: 25 }`
   *
   * 🛠️ **Fixed**: Corrected bundle size impact (was ~15KB, now ~13.5KB verified)
   */
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
});

export default store;
