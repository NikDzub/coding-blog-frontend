import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EditIcon from '@mui/icons-material/Edit';

import TagCrumbs from '../TagCrumbs';

import { useDispatch, useSelector } from 'react-redux';
import { toggleLikePostThunk } from '../../redux/slices/auth';
import { Link } from 'react-router-dom';
import { format } from 'date-format-parse';

import styles from './PostCard.module.scss';

export default function PostCard({ item }) {
  const link = 'http://localhost:4455';
  const dispatch = useDispatch();

  const { user } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const [likeCount, setLikeCount] = React.useState(item.likeCount);

  return (
    <Card sx={{ backgroundColor: '#303030', width: '100%' }}>
      <CardActionArea>
        <Link to={`/profile/${item.owner.username}`}>
          <CardHeader
            style={{ color: 'white', padding: '10px' }}
            avatar={<Avatar src={`${link}${item.owner.avatar}`}></Avatar>}
            title={item.owner.username}
            subheader={format(item.createdAt, 'YYYY/MM/DD H:mm')}
            subheaderTypographyProps={{
              color: 'lightgray',
              fontSize: '0.8rem',
            }}
          />
        </Link>

        <div className={styles.postStats}>
          <VisibilityIcon></VisibilityIcon> {item.viewCount}
          <div
            onClick={async () => {
              const { payload } = await dispatch(toggleLikePostThunk(item._id));
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
            {user?.likedPosts.includes(item._id) ? (
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
          <MessageIcon></MessageIcon> {item.comments.length}
          {user?.username === item.owner.username && (
            <Link to={`/blog/edit/${item._id}`}>
              <EditIcon style={{ color: 'white' }}></EditIcon>
            </Link>
          )}
        </div>
        <Link to={`/blog/${item._id}`}>
          <CardMedia
            component="img"
            height="100%"
            image={`${link}${item.img}`}
            alt={`${item.title}`}
          />
          <CardContent style={{ color: 'white', padding: '5px 10px' }}>
            <Typography gutterBottom variant="h5" component="div">
              {item.title}
            </Typography>
            <TagCrumbs bg="none" color="white" tags={item.tags}></TagCrumbs>
            {/* <Typography variant="body2" color="text.secondary">
            {item.title}
          </Typography> */}
          </CardContent>
        </Link>
      </CardActionArea>
    </Card>
  );
}
