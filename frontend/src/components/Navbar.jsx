import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material'; // MUI components
import { styled } from '@mui/system'; // For custom styling

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isAuthenticated = !!localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#333' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          SeeIt
        </Typography>
        <div>
          {isAuthenticated && (
            <>
              {currentPath === "/upload" ? (
                <StyledLink to="/images">
                  <StyledButton>Gallery</StyledButton>
                </StyledLink>
              ) : currentPath === "/images" ? (
                <StyledLink to="/upload">
                  <StyledButton>Upload</StyledButton>
                </StyledLink>
              ) : null}
              <StyledButton onClick={handleLogout}>Logout</StyledButton>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

// Custom styled components
const StyledLink = styled(Link)({
  textDecoration: 'none',
});

const StyledButton = styled(Button)({
  backgroundColor: '#ff4b5c',
  color: '#fff',
  margin: '0 10px',
  '&:hover': {
    backgroundColor: '#ff1f38',
  },
  fontSize: '16px',
  padding: '8px 16px',
  textTransform: 'none',
});

export default Navbar;
