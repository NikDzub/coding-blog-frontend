import React from 'react';

import axios from '../../../api';

import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { format } from 'date-format-parse';

import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { Link } from 'react-router-dom';

import NewComment from './NewComment';
import Replies from './Replies';

import styles from './Comments.module.scss';

const Comments = ({ comments }) => {
  const link = process.env.REACT_APP_API_URL;
  const postId = useLocation().pathname.replace('/blog/', '');

  const { user, status } = useSelector((state) => {
    return state.authReducer.auth;
  });

  const [stateComments, setStateComments] = React.useState(comments);
  const [reply, setReply] = React.useState(null);

  const deleteHandler = async (commentId) => {
    try {
      const { data } = await axios.patch(`/blog/comment/${postId}`, {
        commentId,
      });
      if (data.message === 'deleted') {
        deleteComment(commentId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = (newComment) => {
    setStateComments((p) => {
      return [...p, newComment];
    });
  };
  const deleteComment = async (commentId) => {
    setStateComments((p) => {
      p = p.filter((c) => {
        return c._id !== commentId;
      });
      return [...p];
    });
  };

  return (
    <div>
      {stateComments.map((c) => {
        if (!c.replyTo) {
          let replies = [];
          stateComments.forEach((r) => {
            if (r.replyTo === c._id) {
              replies.push(r);
            }
          });

          return (
            <Box
              key={c._id}
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
              <Paper elevation={5}>
                <CardHeader
                  avatar={
                    <Link to={`/profile/${c.owner.username}`}>
                      <Avatar
                        src={`${link}${c.owner.avatar}`}
                        aria-label="recipe"
                      ></Avatar>
                    </Link>
                  }
                  title={c.owner.username}
                  subheader={format(c.createdAt, 'YYYY/MM/DD H:mm')}
                  subheaderTypographyProps={{ fontSize: '0.8rem' }}
                  action={
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <ReplyIcon
                        style={{ cursor: 'pointer' }}
                        className={
                          reply?.id === c._id ? styles.replyActive : ''
                        }
                        onClick={() => {
                          setReply((p) => {
                            if (p?.id === c._id) {
                              return null;
                            }
                            return { id: c._id, user: c.owner.username };
                          });
                        }}
                      ></ReplyIcon>
                      {user && user.username === c.owner.username && (
                        <DeleteIcon
                          style={{
                            cursor: 'pointer',
                            display: 'block',
                            right: '0px',
                            justifyContent: 'start',
                          }}
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete the comment?'
                              )
                            ) {
                              deleteHandler(c._id);
                            }
                          }}
                        >
                          delete
                        </DeleteIcon>
                      )}
                    </div>
                  }
                />

                <CardContent>
                  <Typography gutterBottom variant="p" component="div">
                    {c.comment}
                  </Typography>
                  <Replies
                    user={user}
                    deleteHandler={deleteHandler}
                    replies={replies}
                  ></Replies>
                </CardContent>
              </Paper>
            </Box>
          );
        }
      })}
      {user && user.username && (
        <NewComment
          setReply={setReply}
          reply={reply}
          addComment={addComment}
        ></NewComment>
      )}
    </div>
  );
};

export default Comments;
