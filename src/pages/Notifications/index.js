import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import Badge from '@mui/material/Badge';
import Spiner from '../../components/Spiner';

import { format } from 'date-format-parse';
import { Link } from 'react-router-dom';
import { AuthThunk } from '../../redux/slices/auth';

import { useDispatch, useSelector } from 'react-redux';
import axios from '../../api';

import styles from './Notifications.module.scss';

export default function Notifications() {
  const link = 'http://localhost:4455';

  const dispatch = useDispatch();
  const { user } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const [notifications, setNotifications] = React.useState(null);

  React.useEffect(() => {
    try {
      axios.get('/profile/notifications').then((res) => {
        res.data
          .sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .map((n) => {
            switch (n.type) {
              case 'follow':
                n.title = `${n.from.username} Followed you`;
                n.link = `/profile/${n.from.username}`;
                break;
              case 'new post':
                n.title = `${n.from.username} Created a new post`;
                n.link = `/blog/${n.meta.postId}`;
                break;
              case 'welcome':
                n.link = `/profile/${user.username}`;
                n.title = `Welcome ${user.username} 🙂`;

              default:
                // n.title = ``;
                // n.link = ``;
                break;
            }
          });

        setNotifications(res.data);
        dispatch(AuthThunk());
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!user) {
    return null;
  }

  if (notifications === null) {
    return <Spiner></Spiner>;
  }

  return (
    <div className={styles.notificationsWraper}>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {notifications?.map((n) => {
          return (
            <Link key={n._id} to={n.link}>
              <ListItem className={styles.notification}>
                {n.from?.avatar && (
                  <ListItemAvatar>
                    <Badge color="error" variant="dot" invisible={n.seen}>
                      <Avatar src={`${link}${n.from.avatar}`}></Avatar>
                    </Badge>
                  </ListItemAvatar>
                )}
                <ListItemText
                  primary={n.title || ''}
                  secondary={format(n.createdAt, 'YYYY/MM/DD H:mm')}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </div>
  );
}
