import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api';

const initialState = {
  auth: {
    user: null,
    status: '',
  },
};

export const LoginThunk = createAsyncThunk('auth/login', async (loginData) => {
  const { data } = await axios.post('/auth/login', loginData);
  window.localStorage.setItem('token', data.token);
  return data.user;
});

export const RegisterThunk = createAsyncThunk(
  'auth/register',
  async (registerData) => {
    const { data } = await axios.post('/auth/register', registerData);
    window.localStorage.setItem('token', data.token);
    return data.user;
  }
);

export const AuthThunk = createAsyncThunk('auth/profile', async () => {
  const { data } = await axios.get('/auth');
  return data;
});

export const toggleLikePostThunk = createAsyncThunk(
  'blog/toggleLikePost',
  async (postId) => {
    const { data } = await axios.patch(`/blog/like/${postId}`);
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.auth.user = null;
      state.auth.status = '';
      window.localStorage.removeItem('token');
    },
  },
  extraReducers: {
    //
    [LoginThunk.pending]: (state, action) => {
      state.auth.status = 'loading';
    },
    [LoginThunk.fulfilled]: (state, action) => {
      state.auth.status = 'logged in';
      state.auth.user = action.payload;
    },
    [LoginThunk.rejected]: (state, action) => {
      state.auth.status = 'login error';
      state.auth.user = null;
    },
    //
    [AuthThunk.pending]: (state, action) => {
      state.auth.status = 'loading';
    },
    [AuthThunk.fulfilled]: (state, action) => {
      state.auth.status = 'logged in';
      state.auth.user = action.payload;
    },
    [AuthThunk.rejected]: (state, action) => {
      state.auth.status = '';
      state.auth.user = null;
    },
    //
    [RegisterThunk.pending]: (state, action) => {
      state.auth.user = null;
      state.auth.status = 'loading';
    },
    [RegisterThunk.fulfilled]: (state, action) => {
      state.auth.status = 'logged in';
      state.auth.user = action.payload;
    },
    [RegisterThunk.rejected]: (state, action) => {
      state.auth.status = 'register error';
      state.auth.user = null;
    },
    //
    [toggleLikePostThunk.pending]: (state, action) => {
      // state.auth.status = 'loading';
    },
    [toggleLikePostThunk.fulfilled]: (state, action) => {
      if (action.payload.message === 'liked') {
        state.auth.user.likedPosts.push(action.payload.postId);
      }
      if (action.payload.message === 'unliked') {
        state.auth.user.likedPosts = state.auth.user.likedPosts.filter((p) => {
          if (p !== action.payload.postId) {
            return p;
          }
        });
      }
    },
    [toggleLikePostThunk.rejected]: (state, action) => {
      state.blog.status = 'like toggle error';
    },
    //
  },
});

export const { logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
