import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Divider, 
  Button, 
  Grid,
  TextField,
  Avatar,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SendIcon from '@mui/icons-material/Send';

const TeamScoreControl = ({ team, logo, score, onIncrement, onDecrement }) => {
  return (
    <Grid item xs={5} sx={{ textAlign: 'center' }}>
      <Avatar 
        src={logo} 
        alt={team}
        sx={{ 
          width: 80, 
          height: 80, 
          margin: '0 auto',
          border: '2px solid',
          borderColor: 'secondary.main'
        }}
      />
      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', color: 'text.primary' }}>
        {team}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mt: 2,
        gap: 2
      }}>
        <IconButton
          onClick={onDecrement}
          disabled={score <= 0}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            color: 'secondary.main',
            '&:hover': {
              bgcolor: 'secondary.light',
              color: 'white'
            },
            '&:disabled': {
              color: 'text.disabled'
            }
          }}
        >
          <RemoveIcon />
        </IconButton>
        
        <Typography variant="h4" sx={{ minWidth: '40px', color: 'text.primary' }}>
          {score}
        </Typography>
        
        <IconButton
          onClick={onIncrement}
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            color: 'secondary.main',
            '&:hover': {
              bgcolor: 'secondary.light',
              color: 'white'
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Grid>
  );
};

const Prediction = () => {
  const teams = {
    home: {
      name: 'Manchester United',
      logo: 'https://cdn.sportmonks.com/images/soccer/teams/14/14.png'
    },
    away: {
      name: 'Arsenal',
      logo: 'https://cdn.sportmonks.com/images/soccer/teams/19/19.png'
    }
  };

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [username, setUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleIncrement = (team) => {
    if (team === 'home') {
      setHomeScore(prev => prev + 1);
    } else {
      setAwayScore(prev => prev + 1);
    }
  };

  const handleDecrement = (team) => {
    if (team === 'home') {
      setHomeScore(prev => (prev > 0 ? prev - 1 : 0));
    } else {
      setAwayScore(prev => (prev > 0 ? prev - 1 : 0));
    }
  };

  const handleSubmit = async () => {
    if (!username) {
      setSnackbar({ open: true, message: 'Please enter your name', severity: 'error' });
      return;
    }

    try {
      // Replace with your actual API call
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          homeTeam: teams.home.name,
          awayTeam: teams.away.name,
          homeScore,
          awayScore
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Prediction submitted successfully!', severity: 'success' });
        // Reset form
        setHomeScore(0);
        setAwayScore(0);
        setUsername('');
      } else {
        throw new Error('Failed to submit prediction');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error submitting prediction', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        borderRadius: 3,
        background: 'linear-gradient(to bottom, #f3e5f5, #ffffff)'
      }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h5" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'secondary.main',
              mb: 1
            }}
          >
            Match Prediction
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            {teams.home.name} vs {teams.away.name}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'secondary.light', mb: 3 }} />

        {/* Score Controls */}
        <Grid container justifyContent="space-around" alignItems="center" sx={{ mb: 3 }}>
          <TeamScoreControl 
            team={teams.home.name}
            logo={teams.home.logo}
            score={homeScore}
            onIncrement={() => handleIncrement('home')}
            onDecrement={() => handleDecrement('home')}
          />

          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>-</Typography>
          </Grid>

          <TeamScoreControl 
            team={teams.away.name}
            logo={teams.away.logo}
            score={awayScore}
            onIncrement={() => handleIncrement('away')}
            onDecrement={() => handleDecrement('away')}
          />
        </Grid>

        {/* Prediction Summary */}
        <Box sx={{ 
          mb: 3,
          p: 2,
          border: '1px solid',
          borderColor: 'secondary.light',
          borderRadius: 1,
          textAlign: 'center',
          bgcolor: 'background.paper'
        }}>
          <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
            Your Prediction:
          </Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            color: 'secondary.main'
          }}>
            {homeScore} - {awayScore}
          </Typography>
        </Box>

        {/* Name Input */}
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            sx: {
              '& fieldset': {
                borderColor: 'secondary.light',
              },
              '&:hover fieldset': {
                borderColor: 'secondary.main',
              },
            }
          }}
        />

        {/* Submit Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          sx={{ 
            py: 1.5,
            borderRadius: 2,
            fontSize: '1.1rem',
            bgcolor: 'secondary.main',
            '&:hover': {
              bgcolor: 'secondary.dark'
            }
          }}
        >
          Submit Prediction
        </Button>
      </Paper>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            bgcolor: snackbar.severity === 'error' ? 'error.light' : 'success.light'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Prediction;