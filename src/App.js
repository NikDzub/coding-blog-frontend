import React from 'react';

import Container from '@mui/material/Container';

import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { AuthThunk } from './redux/slices/auth';

import {
  Home,
  Login,
  Register,
  ViewPost,
  EditPost,
  CreatePost,
  UserProfile,
  Notifications,
} from './pages';

import ResponsiveAppBar from './components/ResponsiveAppBar';

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(AuthThunk());
  }, []);

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route
            path="/notifications"
            element={<Notifications></Notifications>}
          ></Route>

          <Route path="/blog/:id" element={<ViewPost></ViewPost>}></Route>
          <Route path="/blog/edit/:id" element={<EditPost></EditPost>}></Route>
          <Route path="/posteditor" element={<CreatePost></CreatePost>}></Route>

          <Route
            path="/profile/:username"
            element={<UserProfile></UserProfile>}
          ></Route>
        </Routes>
      </Container>
    </div>
  );
}

export default App;
