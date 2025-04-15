/**
 * CORE API SLICE (BASE CONFIGURATION)
 *
 * Responsibilities:
 * 1. Central API configuration for all endpoints
 * 2. Base query setup with global defaults
 * 3. Tag-based cache invalidation system
 *
 * Architecture Role:
 * - Serves as foundation for all API endpoints (DRY principle)
 * - Integrates with Redux store via configureStore
 * - Provides consistent error handling
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../../constants/constants.js";

// ========================
// BASE QUERY CONFIGURATION
// ========================
/**
 * fetchBaseQuery Instance
 *
 * Key Features:
 * - Automatic response parsing (JSON/text)
 * - Default headers configuration
 * - Base URL for all requests
 *
 * Security Considerations:
 * - Credentials handling (cookies/auth)
 * - CSRF protection requirements
 * - Content-Type defaults
 */
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  // Recommended extensions:
  // prepareHeaders: (headers) => {
  //   headers.set('Authorization', `Bearer ${getAuthToken()}`);
  //   return headers;
  // },
  // credentials: 'include' // For session cookies
});

// ========================
// API SLICE DEFINITION
// ========================
export const apiSlice = createApi({
  /**
   * Core Configuration
   *
   * baseQuery: The fetch implementation
   * tagTypes: Cache tags for invalidation
   * endpoints: Builder function (extended elsewhere)
   *
   * Design Pattern:
   * - Empty endpoints object enables code-splitting
   * - Actual endpoints injected via injectEndpoints()
   */
  baseQuery, // Shared fetch configuration

  /**
   * Cache Tag System
   *
   * TagTypes: ['Product', 'Order', 'User']
   * Usage:
   * - providesTags: Declare what data an endpoint provides
   * - invalidatesTags: Declare what to invalidate after mutations
   *
   * Example Flow:
   * 1. Product update mutation runs
   * 2. Invalidates 'Product' tag
   * 3. All queries providing 'Product' re-fetch
   */
  tagTypes: ["Product", "Order", "User"], // Entity-based cache groups

  /**
   * Endpoints Placeholder
   *
   * Purposefully empty - enables:
   * 1. Code splitting across multiple files
   * 2. Feature-based API organization
   * 3. Dynamic endpoint injection
   */
  endpoints: (builder) => ({}), // To be extended via injectEndpoints

  // ========================
  // ADVANCED OPTIONS (Commented Examples)
  // ========================
  // extractRehydrationInfo(action, { reducerPath }) {
  //   if (action.type === HYDRATE) {
  //     return action.payload[reducerPath];
  //   }
  // },
  // refetchOnMountOrArgChange: 30, // Seconds
  // refetchOnFocus: true, // Requires setupListeners
  // refetchOnReconnect: true
});
