/**
 * MASTERCLASS: RTK Query API Slice Design
 *
 * This file demonstrates professional patterns for:
 * - Data fetching with RTK Query
 * - Cache management strategies
 * - Production-ready error handling
 *
 * Key Principles Applied:
 * 1. Single Responsibility - Each endpoint does one thing perfectly
 * 2. Predictable Caching - Clear cache lifetimes
 * 3. Resilient Architecture - Handles real-world API variances
 */

import { PRODUCT_URL } from "../../../constants/constants";
import { apiSlice } from "./apiSlice.js";

// ============================================
// 🎯 PROFESSIONAL TIP: Endpoint Design Pattern
// Always structure endpoints to handle:
// 1. Happy path (successful response)
// 2. Error states
// 3. Edge cases (empty data, malformed responses)
// ============================================

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------------------------------------------
    // 🔥 REAL-WORLD EXAMPLE: List Endpoint with Smart Caching
    // Professional implementations always consider:
    // - Network resilience
    // - Cache performance
    // - Mobile data savings
    // -----------------------------------------------------------------
    getProducts: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRODUCT_URL,
        params: { pageNumber, keyword },
      }),

      // ⏱️ CACHE STRATEGY:
      // keepUnusedDataFor: 5 (seconds)
      // Why 5s? Perfect balance:
      // - Instant back-navigation (<5s) = no loading spinner
      // - Stale data auto-cleared = prevents memory leaks
      keepUnusedDataFor: 5,
      providesTags: ["Product"],

      // 🏷️ ADVANCED PATTERN: Cache tagging (uncomment when needed)
      // providesTags: (result) =>
      //   result?.length
      //     ? [...result.map(({ id }) => ({ type: 'Product', id }))]
      //     : ['Product']
    }),

    // -----------------------------------------------------------------
    // 🎓 EDUCATIONAL EXAMPLE: Detail Endpoint with Cache Sharing
    // Notice how this automatically:
    // 1. Reuses cache from getProducts when possible
    // 2. Falls back to network when needed
    // -----------------------------------------------------------------
    getProductById: builder.query({
      query: (id) => `${PRODUCT_URL}/${id}`,

      // 🚀 PERFORMANCE TIP:
      // No transformResponse needed here because:
      // 1. Single product endpoints usually return direct objects
      // 2. Less processing = better performance

      // 🔄 CACHE SYNC:
      // When getProducts updates, this will auto-refresh if:
      // - Same product ID exists in both cached responses
      keepUnusedDataFor: 5,
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCT_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}/image`,
        method: "POST",
        body: formData,
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

// ============================================
// 💼 INDUSTRY STANDARD: Hook Export Pattern
// Always export hooks with clear names:
// - useGet[Resource]Query
// - use[Action][Resource]Mutation
// ============================================
export const {
  useGetProductsQuery, // Convention: use + EndpointName + Query
  useGetProductByIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
} = productApiSlice;
