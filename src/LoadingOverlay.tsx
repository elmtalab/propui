import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface LoadingOverlayProps {
  open: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open }) => (
  <Backdrop
    open={open}
    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

export default LoadingOverlay;
