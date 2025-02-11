import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

//API CALLS USING REDUX THUNKS

//GET ALL destinationS
export const fetchDestinations = createAsyncThunk(
  "destinations/fetchDestinations",
  async () => {
    try {
      const response = await axios.get(
        "https://playground-014-backend.vercel.app/api/get-destinations"
      );

      return response.data;
    } catch (error) {
      console.error("Fetch Error: ", error);
      throw error;
    }
  }
);

//GET destination BY ID
export const fetchDestinationById = createAsyncThunk(
  "destinations/fetchDestinationById",
  async (destinationId) => {
    try {
      const response = await axios.get(
        `https://playground-014-backend.vercel.app/api/get-destination/${destinationId}`
      );

      return response.data;
    } catch (error) {
      console.error("Fetch Error: ", error);
      throw error;
    }
  }
);

//POST destination
export const postDestination = createAsyncThunk(
  "destinations/postDestination",
  async (formData) => {
    try {
      const response = await axios.post(
        "https://playground-014-backend.vercel.app/api/post-destination",
        formData
      );

      return response.data;
    } catch (error) {
      console.error("Post Error: ", error);
      throw error;
    }
  }
);

//UPDATE EXISTING destination
export const updateDestination = createAsyncThunk(
  "destinations/updateDestination",
  async ({ formData, destinationId }) => {
    try {
      const response = await axios.put(
        `https://playground-014-backend.vercel.app/api/put-destination/${destinationId}`,
        formData
      );

      return response.data;
    } catch (error) {
      console.error("Put Error: ", error);
      throw error;
    }
  }
);

//DELETE EXISTING destination
export const deleteDestination = createAsyncThunk(
  "destinations/deleteDestination",
  async (destinationId) => {
    try {
      const response = await axios.delete(
        `https://playground-014-backend.vercel.app/api/delete-destination/${destinationId}`
      );

      return { destinationId };
    } catch (error) {
      console.error("Delete Error: ", error);
      throw error;
    }
  }
);

export const destinationSlice = createSlice({
  name: "Destinations",
  initialState: {
    destinations: [],
    singleDestination: null,
    fetchStatus: "idle",
    error: null,
    fetchByIdStatus: "idle",
    addStatus: "idle",
    deleteStatus: "idle",
    updateStatus: "idle",
    searchFilter: "",
  },
  reducers: {
    setSearchFilter: (state, action) => {
      state.searchFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDestinations.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.fetchStatus = "success";
        state.destinations = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.fetchStatus = "error";
        state.error = action.error.message;
      })
      .addCase(fetchDestinationById.pending, (state) => {
        state.fetchByIdStatus = "loading";
      })
      .addCase(fetchDestinationById.fulfilled, (state, action) => {
        state.fetchByIdStatus = "success";
        state.singleDestination = action.payload;
      })
      .addCase(fetchDestinationById.rejected, (state, action) => {
        state.fetchByIdStatus = "error";
        state.error = action.error.message;
      })
      .addCase(postDestination.pending, (state) => {
        state.addStatus = "loading";
      })
      .addCase(postDestination.fulfilled, (state, action) => {
        state.addStatus = "success";
        state.destinations.push(action.payload);
      })
      .addCase(postDestination.rejected, (state, action) => {
        state.addStatus = "error";
        state.error = action.error.message;
      })
      .addCase(deleteDestination.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        state.destinations = state.destinations.filter(
          (member) => member._id !== action.payload.destinationId
        );
      })
      .addCase(deleteDestination.rejected, (state, action) => {
        state.deleteStatus = "error";
        state.error = action.error.message;
      })
      .addCase(updateDestination.pending, (state) => {
        state.updateStatus = "loading";
      })
      .addCase(updateDestination.fulfilled, (state, action) => {
        state.updateStatus = "success";
        const updatedDestination = action.payload;
        const index = state.destinations.findIndex(
          (destination) => destination._id === updatedDestination._id
        );
        if (index !== -1) {
          state.destinations[index] = updatedDestination;
        }
      })
      .addCase(updateDestination.rejected, (state, action) => {
        state.updateStatus = "error";
        state.error = action.error.message;
      });
  },
});

export const getAllDestinations = (state) => state.destinations.destinations;
export const getDestinationById = (state) =>
  state.destinations.singleDestination;

export const getDestinationStatus = createSelector(
  (state) => state.destinations.fetchStatus,
  (state) => state.destinations.addStatus,
  (state) => state.destinations.deleteStatus,
  (state) => state.destinations.updateStatus,
  (state) => state.destinations.fetchByIdStatus,

  (fetchStatus, addStatus, deleteStatus, updateStatus, fetchByIdStatus) => ({
    fetchStatus,
    addStatus,
    deleteStatus,
    updateStatus,
    fetchByIdStatus,
  })
);

export const selectFilteredDestinations = createSelector(
  // Input selectors (first argument)
  [getAllDestinations, (state) => state.destinations.searchFilter],

  // Result function (second argument)
  (destinations, searchFilter) => {
    // If no search filter is entered, return all destinations
    if (!searchFilter) return destinations;

    // Filter destinations based on search criteria
    return destinations.filter(
      (destination) =>
        destination.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        destination.country.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }
);

export default destinationSlice.reducer;
export const { setSearchFilter } = destinationSlice.actions;
