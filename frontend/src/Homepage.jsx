import React, { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Link,
  Paper,
  Divider,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { 
  Twitter,
  Instagram,
  YouTube,
  Menu as MenuIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

// Create purple theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#7b1fa2',  // Deep purple
      light: '#ae52d4', // Lighter purple
      dark: '#4a0072',  // Darker purple
    },
    secondary: {
      main: '#f3e5f5',  // Light purple for accents
    },
    background: {
      default: '#faf5ff', // Very light purple background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Custom TikTok icon component
const TikTok = () => (
  <img 
    src='https://img.icons8.com/?size=100&id=118638&format=png&color=000000'
    alt="TikTok" 
    style={{ 
      width: '24px', 
      height: '24px',
      filter: 'brightness(0) saturate(100%)'
    }} 
  />
);

const Homepage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Navigation items
  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Gallery', path: '/gallery' },
    { text: 'Shop', path: '/shop' },
    { text: 'Predictions', path: '/prediction' },
    { text: 'Blog', path: '/blog' },
    { text: 'Events', path: '/events' },
    { text: 'Partners', path: '/partners' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar */}
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            {/* Logo with RouterLink */}
            <Box 
              component={RouterLink}
              to="/"
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                flexGrow: 1
              }}
            >
              <img 
                src={require('./assets/Benderspodlogo1.jpeg')} 
                alt="Benders Pod" 
                style={{ 
                  height: '40px',
                  width: 'auto',
                  maxWidth: '200px'
                }} 
              />
            </Box>
            
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' },
                ml: 'auto'
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop links */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              ml: 'auto'
            }}>
              {navItems.map((item) => (
                <Link 
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  color="inherit" 
                  sx={{ 
                    mx: 1.5, 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#f3e5f5' }
                  }}
                >
                  {item.text}
                </Link>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: 240,
              bgcolor: 'primary.dark',
              color: 'white'
            }
          }}
        >
          <Box onClick={handleDrawerToggle} sx={{ p: 2 }}>
            <List>
              {navItems.map((item) => (
                <ListItem 
                  button 
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.light'
                    }
                  }}
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Container maxWidth="md" sx={{ flex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              mb: 4,
              textAlign: 'center',
              color: 'primary.main'
            }}
          >
            PODCASTS
          </Typography>

          {/* Podcast Listings */}
          <Paper elevation={3} sx={{ 
            p: 4, 
            mb: 4,
            background: 'linear-gradient(to bottom, #f3e5f5, #ffffff)'
          }}>
            {/* Transfer Daily */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h2" sx={{ 
                fontWeight: 'bold',
                color: 'primary.dark'
              }}>
                TRANSFER DAILY
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                color: 'primary.light',
                fontStyle: 'italic'
              }}>
                PODCAST
              </Typography>
            </Box>

            <Divider sx={{ 
              my: 2,
              borderColor: 'primary.light',
              borderWidth: '1px'
            }} />

            {/* Fourever Arsenal */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" component="h2" sx={{ 
                fontWeight: 'bold',
                color: 'primary.dark'
              }}>
                BENDERS POD
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                color: 'primary.light',
                fontStyle: 'italic'
              }}>
                BENDERSPOD
              </Typography>
            </Box>
          </Paper>
        </Container>

        {/* Footer with Social Media */}
        <Box component="footer" sx={{ 
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'primary.dark',
          color: 'white'
        }}>
          <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: 'inherit' }}>
              Connect with us on social media
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton 
                aria-label="Twitter" 
                href="https://twitter.com/yourhandle" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mx: 1,
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <Twitter />
              </IconButton>
              <IconButton 
                aria-label="Instagram" 
                href="https://www.instagram.com/__al.tunechi" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mx: 1,
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton 
                aria-label="YouTube" 
                href="https://www.youtube.com/@TheBenders_Pod" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mx: 1,
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <YouTube />
              </IconButton>
              <IconButton 
                aria-label="TikTok" 
                href="https://www.tiktok.com/@yourusername" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  mx: 1,
                  color: 'white',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <TikTok />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
              © {new Date().getFullYear()} Benderspod. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Homepage;