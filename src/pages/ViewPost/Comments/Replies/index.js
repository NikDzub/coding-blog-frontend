import React from 'react';

import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { useSelector } from 'react-redux';

import { format } from 'date-format-parse';

import { Link } from 'react-router-dom';

const Replies = ({ user, deleteHandler, replies }) => {
  const link = 'http://localhost:4455';

  const [hidden, setHidden] = React.useState(true);

  return (
    <>
      <p
        style={{
          cursor: 'pointer',
          color: 'grey',
        }}
        onClick={() => {
          setHidden((p) => {
            return !p;
          });
        }}
      >{`${hidden ? 'show' : 'hide'} replies (${replies.length})`}</p>

      {!hidden &&
        replies.map((r) => {
          return (
            <Paper
              style={{
                backgroundColor: 'lightgrey',
                marginBottom: '5px',
              }}
              key={r._id}
              elevation={1}
            >
              <CardHeader
                avatar={
                  <Link to={`profile/${r.owner.username}`}>
                    <Avatar src={`${link}${r.owner.avatar}`}></Avatar>
                  </Link>
                }
                title={r.owner.username}
                subheader={format(r.createdAt, 'YYYY/MM/DD H:mm')}
                subheaderTypographyProps={{ fontSize: '0.8rem' }}
                action={
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    {user && user.username === r.owner.username && (
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
                              'Are you sure you want to delete the reply?'
                            )
                          ) {
                            deleteHandler(r._id);
                          }
                        }}
                      >
                        delete
                      </DeleteIcon>
                    )}
                  </div>
                }
              ></CardHeader>

              <CardContent>
                <Typography variant="p">{r.comment}</Typography>
              </CardContent>
            </Paper>
          );
        })}
    </>
  );
};

export default Replies;
