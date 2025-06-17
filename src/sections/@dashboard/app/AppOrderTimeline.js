// @mui
import PropTypes from 'prop-types';
import { Card, Typography, CardHeader, CardContent, Box } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
// utils
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

AppOrderTimeline.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  list: PropTypes.array.isRequired,
};

export default function AppOrderTimeline({ title, subheader, list, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <CardContent
        sx={{
          '& .MuiTimelineItem-missingOppositeContent:before': {
            display: 'none',
          },
        }}
      >
        <Timeline>
          {list.map((item, index) => (
            <OrderItem key={item.id} item={item} isLast={index === list.length - 1} />
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------------------------------------

OrderItem.propTypes = {
  isLast: PropTypes.bool,
  item: PropTypes.shape({
    time: PropTypes.instanceOf(Date),
    title: PropTypes.string,
    type: PropTypes.string,
  }),
};

function OrderItem({ item, isLast }) {
  const { type, title, time } = item;
  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          color={
            (type === 'order1' && 'primary') ||
            (type === 'order2' && 'success') ||
            (type === 'order3' && 'info') ||
            (type === 'order4' && 'warning') ||
            'error'
          }
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle2" sx={{ lineHeight: 1 }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTime(time)}
          </Typography>
          {item?.author_name && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              |
            </Typography>
          )}
          {item?.author_name && (
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {item?.author_name}
            </Typography>
          )}
        </Box>
      </TimelineContent>
    </TimelineItem>
  );
}
