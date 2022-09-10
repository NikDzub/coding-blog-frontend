import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';

import Avatar from '@mui/material/Avatar';

import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePostThunk } from '../../../redux/slices/auth';

import styles from './PostInfo.module.scss';

const PostInfo = ({ post }) => {
  const link = 'http://localhost:4455';

  const dispatch = useDispatch();

  const { user } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const [likeCount, setLikeCount] = React.useState(post.likeCount);

  return (
    <>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem>
          <ListItemAvatar>
            <Link to={`/profile/${post.owner.username}`}>
              <Avatar src={`${link}${post.owner.avatar}`}></Avatar>
            </Link>
          </ListItemAvatar>
          <ListItemText primary={post.owner.username} secondary="Jan 9, 2014" />
        </ListItem>

        <div className={styles.postStats}>
          <VisibilityIcon></VisibilityIcon> {post.viewCount}
          <div
            onClick={async () => {
              const { payload } = await dispatch(toggleLikePostThunk(post._id));
              if (payload.message === 'liked') {
                setLikeCount((p) => {
                  return ++p;
                });
              }
              if (payload.message === 'unliked') {
                setLikeCount((p) => {
                  return --p;
                });
              }
            }}
          >
            {user?.likedPosts.includes(post._id) ? (
              <div className={styles.likeContainer}>
                <FavoriteIcon className={styles.liked}></FavoriteIcon>{' '}
                <span> {likeCount} </span>
              </div>
            ) : (
              <div className={styles.likeContainer}>
                <FavoriteIcon></FavoriteIcon>
                <span> {likeCount} </span>
              </div>
            )}
          </div>
          <MessageIcon></MessageIcon> {post.comments.length}
          {user?.username === post.owner.username && (
            <Link to={`/blog/edit/${post._id}`}>
              <EditIcon></EditIcon>
            </Link>
          )}
        </div>
      </List>
    </>
  );
};

export default PostInfo;
