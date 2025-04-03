import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import api from "./api";
import { Item } from "../types/item";

// For RTK Query
/**
 * The `itemsApi` is an RTK Query API slice for managing CRUD operations on items.
 * It interacts with a REST API hosted at `https://jsonplaceholder.typicode.com`.
 *
 * @remarks
 * This API slice is configured with the following endpoints:
 * - `getItems`: Fetches a list of items.
 * - `getItemById`: Fetches a single item by its ID.
 * - `addItem`: Adds a new item.
 * - `updateItem`: Updates an existing item.
 * - `deleteItem`: Deletes an item by its ID.
 *
 * @example
 * ```typescript
 * // Usage in a React component
 * const { data: items } = useGetItemsQuery();
 * const [addItem] = useAddItemMutation();
 * ```
 *
 * @see {@link https://redux-toolkit.js.org/rtk-query/overview | RTK Query Documentation}
 */
export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com",
  }),
  tagTypes: ["Item"],
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => "/posts",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Item" as const, id })),
              { type: "Item", id: "LIST" },
            ]
          : [{ type: "Item", id: "LIST" }],
    }),
    getItemById: builder.query<Item, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (_, __, id) => [{ type: "Item", id }],
    }),
    addItem: builder.mutation<Item, Omit<Item, "id">>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Item", id: "LIST" }],
    }),
    updateItem: builder.mutation<Item, Item>({
      query: (item) => ({
        url: `/posts/${item.id}`,
        method: "PUT",
        body: item,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Item", id }],
    }),
    deleteItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Item", id }],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemsApi;

// Regular API functions for thunks
export const fetchItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const fetchItemById = async (id: string): Promise<Item> => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw error;
  }
};

export const createItem = async (item: Omit<Item, "id">): Promise<Item> => {
  try {
    const response = await api.post("/posts", item);
    return response.data;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
};

export const updateItem = async (item: Item): Promise<Item> => {
  try {
    const response = await api.put(`/posts/${item.id}`, item);
    return response.data;
  } catch (error) {
    console.error(`Error updating item ${item.id}:`, error);
    throw error;
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/posts/${id}`);
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    throw error;
  }
};
