import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import { format } from 'date-format-parse';
import { Link } from 'react-router-dom';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

export default function PostsTable({ posts }) {
  const link = 'http://localhost:4455';
  let rows = [];
  posts.map((p) => {
    rows.push(
      createData(
        <Link
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textDecoration: 'underline',
          }}
          to={`/blog/${p._id}`}
        >
          <Avatar
            style={{ marginRight: '5px' }}
            src={`${link}${p.img}`}
          ></Avatar>
          {p.title}
        </Link>,
        p.viewCount,
        p.likeCount,
        format(p.createdAt, 'YYYY-MM-DD'),
        p.tags.toString().replace(',', ' ')
      )
    );
  });
  return (
    <TableContainer
      style={{ marginTop: '10px', width: '80%' }}
      component={Paper}
    >
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell align="right">Views</TableCell>
            <TableCell align="right">Likes</TableCell>
            <TableCell align="right">Created at</TableCell>
            <TableCell align="right">Tags</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index + row.calories}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
