/* eslint-disable import/no-unresolved */
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Typography from '@mui/material/Typography';
import { apiUrl } from 'src/hooks/api';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import stripTags from 'striptags';
import { textEllipsis } from 'src/utils/textEliipsis';
import { Box, Chip } from '@mui/material';
import { grey } from '@mui/material/colors';
import { fDateTime } from 'src/utils/formatTime';

function CardNews({ item, handleClickCard = () => {} }) {
  const textHTML = stripTags(item?.html);

  return (
    <Card
      onClick={() => handleClickCard(item)}
      sx={{
        width: 355,
        transition: '0.3s all',
        cursor: 'pointer',
        '&:hover': {
          scale: '1.03',
        },
      }}
    >
      <CardMedia
        children={
          !item?.thumbnail ? (
            <Box
              sx={{
                height: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src="/assets/logo_pgri.png"
                style={{
                  height: '100px',
                  opacity: '0.3',
                }}
                alt="logo_pic"
              />
            </Box>
          ) : null
        }
        sx={{ height: 240, bgcolor: '#f0f0f0' }}
        image={item?.thumbnail ? `${apiUrl}news-thumbnail/${item?.thumbnail}` : '/'}
        title={item?.title}
      />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          pt: 1,
        }}
      >
        {Boolean(item?.isPrivate) ? <Chip label="Private" color="primary" /> : <Chip label="Public" color="info" />}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
            }}
          >
            <FavoriteIcon sx={{ width: 20, color: grey[500] }} />
            <Typography variant="caption">{item?.up_vote}</Typography>
          </Box>
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
            }}
          >
            <ChatBubbleIcon sx={{ color: grey[500] }} />
            <Typography variant="caption">12</Typography>
          </Box> */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
            }}
          >
            <ThumbDownAltIcon sx={{ width: 20, color: grey[500] }} />
            <Typography variant="caption">{item?.down_vote}</Typography>
          </Box>
        </Box>
      </Box>
      <CardContent style={{ paddingTop: '10px' }}>
        <Typography gutterBottom variant="h5" component="div" textTransform="capitalize">
          {item?.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {textEllipsis(textHTML, 200)}
        </Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 0.5,
          pb: 2,
          pr: 2,
        }}
      >
        <AccessTimeIcon sx={{ color: grey[500] }} />
        <Typography color={grey[500]} variant="caption">
          {fDateTime(new Date().toISOString())}
        </Typography>
      </Box>
    </Card>
  );
}
export default React.memo(CardNews);
