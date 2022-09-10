import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getAllThunk } from '../../redux/slices/blog';

import PostCard from '../../components/PostCard';
import Spiner from '../../components/Spiner';

import { Select, FormControl, Input, MenuItem, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import styles from './Home.module.scss';

const Home = () => {
  const dispatch = useDispatch();

  const { items, status } = useSelector((state) => {
    return state.blogReducer.blog;
  });

  const posts = [...items];

  const [sort, setSort] = React.useState('viewCount');
  const [filter, setFilter] = React.useState('');

  const handleChange = (e) => {
    setSort(e.target.value);
  };

  const searchHandler = (e) => {
    setFilter((p) => {
      return e.target.value.toLowerCase();
    });
  };

  const [colums, setColums] = React.useState(3);

  function valuetext(value) {
    return `${value}°C`;
  }

  React.useEffect(() => {
    dispatch(getAllThunk());
  }, []);

  if (status !== 'loaded' && [...items].length < 1) {
    return <Spiner status={status}></Spiner>;
  }

  return (
    <>
      <div className={styles.Search}>
        <FormControl
          size="small"
          variant="outlined"
          sx={{
            m: 1,
            width: '20%',
            margin: '10px 0px',
            padding: '0px 0px',
          }}
        >
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={sort}
            onChange={handleChange}
            label="Sort"
            style={{ color: 'white' }}
          >
            <MenuItem value={'viewCount'}>Views</MenuItem>
            <MenuItem value={'likeCount'}>Likes</MenuItem>
            <MenuItem value={'createdAt'}>Date</MenuItem>
          </Select>
        </FormControl>

        <Input
          onChange={searchHandler}
          placeholder="Search"
          sx={{
            color: 'white',
            width: '20%',
            margin: '10px 10px',
            padding: '0px 10px',
          }}
        ></Input>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '150px',
          }}
        >
          <Slider
            onChange={(e) => {
              setColums((p) => {
                if (p !== e.target.value) {
                  return e.target.value;
                }
                return p;
              });
            }}
            defaultValue={colums}
            value={colums}
            step={1}
            min={1}
            max={5}
          />
        </Box>
      </div>

      {filter && (
        <ImageList
          sx={{ width: '100%' }}
          variant="masonry"
          cols={colums}
          rowHeight={'auto'}
        >
          {posts
            ?.filter((a) => {
              if (
                a.title.toLowerCase().includes(filter) ||
                a.owner.username.toLowerCase().includes(filter) ||
                a.body.toLowerCase().includes(filter) ||
                a.tags.indexOf(filter) !== -1
              ) {
                return true;
              }
            })
            .map((i) => {
              return (
                <ImageListItem cols={1} rows={1} key={i._id}>
                  <PostCard item={i}></PostCard>
                </ImageListItem>
              );
            })}
        </ImageList>
      )}

      {!filter && (
        <ImageList
          sx={{ width: '100%' }}
          variant="masonry"
          cols={colums}
          rowHeight={'auto'}
        >
          {posts
            ?.sort((a, b) => {
              if (sort === 'createdAt') {
                return new Date(b[sort]) - new Date(a[sort]);
              }

              return b[sort] - a[sort];
            })
            .map((i) => {
              return (
                <ImageListItem cols={1} rows={1} key={i._id}>
                  <PostCard item={i}></PostCard>
                </ImageListItem>
              );
            })}
        </ImageList>
      )}
    </>
  );
};

export default Home;
