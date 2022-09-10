import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api';

const initialState = {
  blog: {
    items: [],
    status: '',
  },
};

export const getAllThunk = createAsyncThunk('posts/getAll', async () => {
  try {
    const { data } = await axios.get('/blog');
    return data.posts;
  } catch (error) {
    console.log(error);
  }
});

export const getOneThunk = createAsyncThunk('blog/getOne', async (postId) => {
  try {
    const { data } = await axios.get(`/blog/${postId}`);
    return data.post;
  } catch (error) {
    console.log(error);
  }
});

export const updatePostThunk = createAsyncThunk(
  'blog/updatePost',
  async (post) => {
    try {
      const { data } = await axios.patch(`/blog/${post.postId}`, post.postData);

      return data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const createPostThunk = createAsyncThunk(
  'blog/createPost',
  async (postData) => {
    const { data } = await axios.post('/blog', postData);
    return data.post;
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: {
    //
    [getAllThunk.pending]: (state, action) => {
      state.blog.status = 'loading';
    },
    [getAllThunk.fulfilled]: (state, action) => {
      state.blog.status = 'loaded';
      state.blog.items = action.payload;
    },
    [getAllThunk.rejected]: (state, action) => {
      state.blog.status = 'fetch error';
      state.blog.items = [];
    },
    //
    [updatePostThunk.pending]: (state, action) => {
      state.blog.status = 'loading';
    },
    [updatePostThunk.fulfilled]: (state, action) => {
      state.blog.status = 'post updated';
    },
    [updatePostThunk.rejected]: (state, action) => {
      state.blog.status = 'update error';
    },
    //
    [createPostThunk.pending]: (state, action) => {
      state.blog.status = 'loading';
    },
    [createPostThunk.fulfilled]: (state, action) => {
      state.blog.status = 'post created';
      state.blog.items = [...state.blog.items, action.payload];
    },
    [createPostThunk.rejected]: (state, action) => {
      state.blog.status = 'create error';
    },
  },
});

export const blogReducer = blogSlice.reducer;
