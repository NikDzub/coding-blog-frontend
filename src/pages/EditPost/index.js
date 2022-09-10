import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import axios from '../../api';
import { useDispatch, useSelector } from 'react-redux';
import { updatePostThunk, getAllThunk } from '../../redux/slices/blog';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

import Spiner from '../../components/Spiner';
import TagCrumbs from '../../components/TagCrumbs';
import { Button, Input } from '@mui/material';

import styles from './EditPost.module.scss';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function EditPost() {
  const link = process.env.REACT_APP_API_URL;

  const postId = useLocation().pathname.replace('/blog/edit/', '');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => {
    return state.authReducer.auth;
  });
  const { items, status } = useSelector((state) => {
    return state.blogReducer.blog;
  });
  const inputFileRef = React.useRef(null);

  const [post, setPost] = React.useState({
    title: '',
    body: '',
    img: '/uploads/basic/blankPost.png',
    tags: [],
  });

  const [newTag, setNewTag] = React.useState('');
  const removeTag = (e) => {
    setPost((p) => {
      let tags = p.tags.filter((t) => t !== e);
      return { ...p, tags };
    });
  };

  const [imgHolder, setImgHolder] = React.useState(null);
  const handleChangeImg = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.addEventListener('load', function () {
          setPost((p) => {
            return { ...p, img: this.result };
          });
        });

        const formData = new FormData();
        formData.append('image', file);
        setImgHolder(formData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditorChange = ({ html, text }) => {
    setPost((p) => {
      return { ...p, body: text };
    });
  };

  const handleSave = async () => {
    try {
      if (imgHolder) {
        const { data } = await axios.post('/upload', imgHolder);
        post.img = data.url.replace(process.env.REACT_APP_API_URL, '');
      }

      dispatch(
        updatePostThunk({
          postData: post,
          postId,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    axios.get(`/blog/${postId}`).then((res) => {
      const post = res.data.post;
      setPost({
        title: post.title,
        body: post.body,
        img: post.img,
        tags: post.tags,
      });
    });
  }, []);

  if (!user || !user.posts.includes(postId)) {
    return (
      <>
        <Spiner status={'Please Login'}></Spiner>
      </>
    );
  }

  if (!post.title) {
    return <Spiner></Spiner>;
  }

  if (status === 'post updated') {
    navigate(`/blog/${postId}`);
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
      <Paper elevation={3}>
        <>
          <div>
            <div className={styles.top}></div>

            <Input
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

            <Input
              onChange={(e) => {
                setNewTag(e.target.value);
                if (e.target.value.slice(-1) === ' ') {
                  if (
                    post.tags.length < 5 &&
                    post.tags.indexOf(e.target.value.replace(' ', '')) === -1
                  ) {
                    setPost((p) => {
                      let tags = p.tags;
                      tags.push(newTag);
                      return { ...p, tags };
                    });
                  }
                  setNewTag('');
                }
              }}
              style={{ width: '20%', marginBottom: '5px' }}
              type="text"
              value={newTag}
              placeholder="# (max 5)"
            />

            <TagCrumbs
              bg="black"
              color="white"
              tags={post.tags}
              removeTag={removeTag}
            ></TagCrumbs>
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
            view={{ menu: true, md: true, html: true }}
            style={{
              marginBottom: '5px',
              height: '60vh',
              width: '100%',
            }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={handleEditorChange}
          />

          <label htmlFor="image-upload">
            <img
              className={styles.imgHover}
              style={{ width: '100%', height: '100px', objectFit: 'cover' }}
              src={imgHolder ? post.img : `${link}${post.img}`}
            ></img>

            <input
              hidden
              accept="image/*"
              id="image-upload"
              ref={inputFileRef}
              type="file"
              onChange={handleChangeImg}
            ></input>
          </label>

          <div>
            <Button
              disabled={!Boolean(post.title.length > 0 && post.body.length > 0)}
              onClick={() => {
                handleSave();
              }}
              variant="contained"
            >
              save
            </Button>
          </div>
        </>
      </Paper>
    </Box>
  );
}
