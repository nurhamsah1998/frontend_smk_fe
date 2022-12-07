import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';
import { blue } from '@mui/material/colors';

export default function AccordionList({ title, content }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Accordion>
        <AccordionSummary
          sx={{
            bgcolor: blue[100],
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: blue[50] }}>
          <Box>{content}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
