import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TagIcon from '@mui/icons-material/Tag';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

import styles from './TagCrumbs.module.scss';

function handleClick(event) {
  event.preventDefault();
}

export default function TagCrumbs({ bg, color, tags, removeTag }) {
  return (
    <div
      style={{
        overflow: 'auto',
      }}
      onClick={handleClick}
    >
      <Stack direction="row" spacing={1}>
        {tags?.map((t) => {
          return (
            <span key={t}>
              <Chip
                style={{
                  height: 'auto',
                  fontSize: '1rem',
                  border: '0px',
                  backgroundColor: bg || 'white',
                  color: color || 'black',
                }}
                className={styles.chip}
                icon={
                  <>
                    <TagIcon
                      style={{
                        marginLeft: '5px',
                      }}
                    ></TagIcon>
                    {removeTag && (
                      <DoDisturbOnIcon
                        onClick={() => {
                          removeTag(t);
                        }}
                      ></DoDisturbOnIcon>
                    )}
                  </>
                }
                label={t}
                variant="outlined"
              />
            </span>
          );
        })}
      </Stack>
    </div>
  );
}
