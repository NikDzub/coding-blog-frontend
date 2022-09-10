import * as React from 'react';

import axios from '../../../../api';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import SendIcon from '@mui/icons-material/Send';
import { Input } from '@mui/material';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import styles from './NewComment.module.scss';

export default function NewComment({ setReply, reply, addComment }) {
  const link = process.env.REACT_APP_API_URL;
  const postId = useLocation().pathname.replace('/blog/', '');
  const { user } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const [comment, setComment] = React.useState('');

  const postComment = async () => {
    try {
      const { data } = await axios.post(`${link}/blog/comment/${postId}`, {
        comment,
        replyTo: reply?.id,
      });

      if (data._id) {
        addComment(data);
      }
      setComment('');
      setReply(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: '100%',
          height: 'auto',
        },
      }}
    >
      <Paper elevation={0}>
        <CardHeader
          avatar={
            <Avatar src={`${link}${user.avatar}`} aria-label="recipe"></Avatar>
          }
          title={user.username}
          action={
            user &&
            user.username && (
              <SendIcon
                onClick={postComment}
                style={{
                  cursor: 'pointer',
                  display: 'block',
                  right: '0px',
                  justifyContent: 'start',
                }}
              >
                delete
              </SendIcon>
            )
          }
        />
        <CardContent>
          <Input
            value={comment}
            placeholder={reply?.user ? `replying to ${reply.user}` : '...'}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            multiline={true}
            type="text"
            sx={{ width: '100%', padding: '10px 10px' }}
            style={{
              border: '0px solid grey',
              borderRadius: '5px',
            }}
          ></Input>
        </CardContent>
      </Paper>
    </Box>
  );
}
