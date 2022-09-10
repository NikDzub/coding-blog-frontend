import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import axios from '../../api';
import { useLocation } from 'react-router-dom';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import Spiner from '../../components/Spiner';
import TagCrumbs from '../../components/TagCrumbs';
import { Button, Input } from '@mui/material';
import PostInfo from './PostInfo';
import Comments from './Comments';

import styles from './ViewPost.module.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function ViewPost() {
  const link = 'http://localhost:4455';

  const postId = useLocation().pathname.replace('/blog/', '');

  const [post, setPost] = React.useState({
    title: '',
    body: '',
    img: '/uploads/basic/blankPost.png',
    tags: [],
  });

  React.useEffect(() => {
    axios.get(`/blog/${postId}`).then((res) => {
      const post = res.data.post;
      setPost({
        ...post,
        // title: post.title,
        // body: post.body,
        // img: post.img,
        // tags: post.tags,
        // comments: post.comments,
      });
    });
  }, []);

  if (!post.title) {
    return <Spiner></Spiner>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: '100%',
          height: 'auto',
          padding: '10px',
        },
      }}
    >
      <Paper>
        <PostInfo post={post}></PostInfo>
      </Paper>

      <Paper elevation={3}>
        <>
          <div>
            <div className={styles.top}></div>

            <img
              className={styles.imgHover}
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
              src={`${link}${post.img}`}
            ></img>

            <Input
              disabled
              onChange={(e) => {
                setPost((p) => {
                  return { ...p, title: e.target.value };
                });
              }}
              style={{ width: '100%', fontWeight: '600' }}
              type="text"
              value={post.title}
              placeholder="Title"
            />

            <TagCrumbs bg="black" color="white" tags={post.tags}></TagCrumbs>
          </div>

          <MdEditor
            value={post.body}
            plugins={[
              'clear',
              'header',
              'font-bold',
              'mode-toggle',
              'list-unordered',
              'block-code-block',
              'link',
              'table',
            ]}
            view={{ menu: false, md: false, html: true }}
            style={{
              border: '0px',
              marginTop: '15px',
              marginBottom: '5px',
              height: '60vh',
              width: '100%',
            }}
            renderHTML={(text) => mdParser.render(text)}
          />

          <div></div>
        </>
      </Paper>

      <Paper>
        <Comments comments={post.comments}></Comments>
      </Paper>
    </Box>
  );
}
