import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import PostsTable from './PostsTable';
import Spiner from '../../components/Spiner';

import axios from '../../api';
import { useLocation } from 'react-router-dom';
import { format } from 'date-format-parse';

import { useDispatch, useSelector } from 'react-redux';
import { AuthThunk } from '../../redux/slices/auth';

import styles from './UserProfile.module.scss';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function UserProfile() {
  const dispatch = useDispatch();
  const link = 'http://localhost:4455';

  const userName = useLocation().pathname.replace('/profile/', '');

  const { user, status } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const [userData, setUserData] = React.useState(null);

  const [displayPosts, setDisplayPosts] = React.useState(false);

  const followHandler = async () => {
    const { data } = await axios.post(`/profile/${userName}`);
    if (data.message === 'Followed') {
      setUserData((p) => {
        p.user.followers.length = p.user.followers.length + 1;
        return { ...p, following: true };
      });
    }
    if (data.message === 'Unfollowed') {
      setUserData((p) => {
        p.user.followers.length = p.user.followers.length - 1;
        return { ...p, following: false };
      });
    }
  };

  const rows = [
    createData('Username', userData?.user?.username),
    createData('Created at', format(userData?.user?.createdAt, 'YYYY-MM-DD')),
    createData('Followers', userData?.user?.followers.length),
    createData('Following', userData?.user?.following.length),
    createData(
      'Posts',
      <span
        onClick={() => {
          setDisplayPosts((p) => !p);
        }}
        style={{ textDecoration: 'underline', cursor: 'pointer' }}
      >
        {userData?.posts?.length}
      </span>
    ),
    createData(
      '',
      user && user.username !== userData?.user.username ? (
        <Button onClick={followHandler} variant="contained">
          {userData?.following ? 'Following' : 'Follow'}
        </Button>
      ) : null
    ),
  ];

  const pfpHandler = async (e) => {
    try {
      if (userData.user.username === user.username) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        const { data } = await axios.post('/upload', formData);
        await axios.post('/upload/pfp', { img: data });

        setUserData((p) => {
          p.user.avatar = data.url;
          return { ...p };
        });
        dispatch(AuthThunk());
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    axios
      .get(`profile/${userName}`)
      .then((res) => {
        setUserData((p) => {
          return { ...res.data };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userName]);

  if (!userData) {
    return <Spiner></Spiner>;
  }

  if (!user && window.localStorage.getItem('token')) {
    return <Spiner></Spiner>;
  }

  return (
    <div className={styles.ProfileWraper}>
      <label htmlFor="image-upload">
        <div>
          <img
            className={
              userData?.user?.username === user?.username
                ? styles.imgHover
                : 'whatever'
            }
            style={{
              marginTop: '10px',
              width: '80px',
              height: '80px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '4px solid white',
            }}
            src={`${link}${userData.user.avatar}`}
          ></img>
        </div>

        {userData?.user?.username === user?.username && (
          <input
            hidden
            accept="image/*"
            id="image-upload"
            type="file"
            onChange={pfpHandler}
          ></input>
        )}
      </label>

      <TableContainer
        style={{ width: '80%', marginTop: '10px' }}
        component={Paper}
      >
        <Table sx={{ width: '100%' }} aria-label="simple table">
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {displayPosts && <PostsTable posts={userData.posts}></PostsTable>}
    </div>
  );
}
