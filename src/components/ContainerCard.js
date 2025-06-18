import { Card } from '@mui/material';
import React from 'react';

function ContainerCard({ children }) {
  return <Card sx={{ px: 4, py: 3, minHeight: 'calc(100dvh - 108px)', position: 'relative' }}>{children}</Card>;
}

export default ContainerCard;
