import React from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container 
        component={motion.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ flexGrow: 1, py: 4 }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default Layout; 