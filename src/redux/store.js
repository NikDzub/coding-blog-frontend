import { configureStore } from '@reduxjs/toolkit';

import { blogReducer } from './slices/blog';
import { authReducer } from './slices/auth';

const store = configureStore({
  reducer: { authReducer, blogReducer },
});

export default store;
