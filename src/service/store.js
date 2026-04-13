import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api/axios";

const userFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

// AUTH

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/login", userData);
      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const { data } = await API.post("/auth/register", userData);
      return data;
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      console.log("REGISTER RESPONSE:", error?.response);
      console.log("REGISTER DATA:", error?.response?.data);

      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed"
      );
    }
  }
);

export const fetchTrainees = createAsyncThunk(
  "auth/fetchTrainees",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/auth/trainees");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch trainees"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: userFromStorage,
    trainees: [],
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTrainees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrainees.fulfilled, (state, action) => {
        state.loading = false;
        state.trainees = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTrainees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// TASKS

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/tasks");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, thunkAPI) => {
    try {
      const { data } = await API.post("/tasks", taskData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "tasks/fetchTaskById",
  async (taskId, thunkAPI) => {
    try {
      const { data } = await API.get("/tasks");
      const taskArray = Array.isArray(data) ? data : [];
      const task = taskArray.find((item) => item._id === taskId);
      return task || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, thunkAPI) => {
    try {
      const { data } = await API.put(`/tasks/${id}`, taskData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, thunkAPI) => {
    try {
      await API.delete(`/tasks/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    selectedTask: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.tasks)) state.tasks = [];
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        );
        state.selectedTask = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// SUBMISSIONS

export const fetchSubmissions = createAsyncThunk(
  "submissions/fetchSubmissions",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/submissions");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch submissions"
      );
    }
  }
);

export const submitTask = createAsyncThunk(
  "submissions/submitTask",
  async (submissionData, thunkAPI) => {
    try {
      const { data } = await API.post("/submissions", submissionData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to submit task"
      );
    }
  }
);

export const reviewSubmission = createAsyncThunk(
  "submissions/reviewSubmission",
  async ({ id, status }, thunkAPI) => {
    try {
      const { data } = await API.put(`/submissions/${id}`, { status });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to review submission"
      );
    }
  }
);

const submissionSlice = createSlice({
  name: "submissions",
  initialState: {
    submissions: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearSubmissionState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.submissions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitTask.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitTask.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        if (!Array.isArray(state.submissions)) {
          state.submissions = [];
        }

        const existingIndex = state.submissions.findIndex(
          (item) => item._id === action.payload._id
        );

        if (existingIndex !== -1) {
          state.submissions[existingIndex] = action.payload;
        } else {
          state.submissions.unshift(action.payload);
        }
      })
      .addCase(submitTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(reviewSubmission.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reviewSubmission.fulfilled, (state, action) => {
        state.loading = false;

        if (!Array.isArray(state.submissions)) {
          state.submissions = [];
        }

        state.submissions = state.submissions.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(reviewSubmission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// ACTION EXPORTS

export const { logout, clearAuthError } = authSlice.actions;
export const { clearTaskError, clearSelectedTask } = taskSlice.actions;
export const { clearSubmissionState } = submissionSlice.actions;

// STORE

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tasks: taskSlice.reducer,
    submissions: submissionSlice.reducer,
  },
});

export default store;