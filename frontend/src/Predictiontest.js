import { useState, useEffect } from 'react';
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
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
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

const Predictiontest = () => {
  const API_TOKEN = 'PbixzLB9hVpUVr8LeyPeTrmZqtirleapenI1L8dPILtjDhfkdlPkGoVRlQrA';
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [username, setUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        setLoading(true);
        // Using CORS proxy for development
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `https://api.sportmonks.com/v3/football/fixtures/upcoming?api_token=${API_TOKEN}&include=participants&per_page=10`;
        
        const response = await fetch(proxyUrl + apiUrl, {
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        
        const data = await response.json();
        setMatches(data.data);
        
        // Select the first match by default
        if (data.data.length > 0) {
          setSelectedMatch(data.data[0]);
        }
      } catch (err) {
        setError(err.message);
        setSnackbar({ open: true, message: 'Error loading matches. You might need to visit the CORS proxy page first.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
  }, []);

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

    if (!selectedMatch) {
      setSnackbar({ open: true, message: 'Please select a match', severity: 'error' });
      return;
    }

    try {
      // Get home and away team from participants
      const homeTeam = selectedMatch.participants.find(p => p.meta.location === 'home');
      const awayTeam = selectedMatch.participants.find(p => p.meta.location === 'away');

      // For testing, we'll just show a success message
      setSnackbar({ 
        open: true, 
        message: `Prediction submitted successfully! (${homeTeam?.name} ${homeScore}-${awayScore} ${awayTeam?.name})`, 
        severity: 'success' 
      });
      
      // In a real app, you would send this to your backend:
      /*
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          fixtureId: selectedMatch.id,
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
          homeScore,
          awayScore,
          matchDate: selectedMatch.starting_at
        }),
      });
      */
      
      // Reset form
      setHomeScore(0);
      setAwayScore(0);
      setUsername('');
    } catch (error) {
      setSnackbar({ open: true, message: 'Error submitting prediction', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMatchChange = (event) => {
    const matchId = event.target.value;
    const match = matches.find(m => m.id === matchId);
    setSelectedMatch(match);
    setHomeScore(0);
    setAwayScore(0);
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Alert severity="error">
          {error} - You might need to visit the <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noopener noreferrer">CORS Anywhere demo page</a> first to enable the proxy.
        </Alert>
      </Container>
    );
  }

  if (!selectedMatch || matches.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Alert severity="info">No upcoming matches available for prediction</Alert>
      </Container>
    );
  }

  // Get home and away team from participants
  const homeTeam = selectedMatch.participants.find(p => p.meta.location === 'home');
  const awayTeam = selectedMatch.participants.find(p => p.meta.location === 'away');

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
            Benderspod Match Prediction
          </Typography>
          
          {/* Match Selection Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="match-select-label">Select Match</InputLabel>
            <Select
              labelId="match-select-label"
              value={selectedMatch.id}
              label="Select Match"
              onChange={handleMatchChange}
            >
              {matches.map(match => {
                const home = match.participants.find(p => p.meta.location === 'home');
                const away = match.participants.find(p => p.meta.location === 'away');
                return (
                  <MenuItem key={match.id} value={match.id}>
                    {home?.name} vs {away?.name} - {new Date(match.starting_at).toLocaleString()}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            {homeTeam?.name} vs {awayTeam?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {new Date(selectedMatch.starting_at).toLocaleString()}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'secondary.light', mb: 3 }} />

        {/* Score Controls */}
        <Grid container justifyContent="space-around" alignItems="center" sx={{ mb: 3 }}>
          <TeamScoreControl 
            team={homeTeam?.name}
            logo={homeTeam?.image_path}
            score={homeScore}
            onIncrement={() => handleIncrement('home')}
            onDecrement={() => handleDecrement('home')}
          />

          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'text.primary' }}>-</Typography>
          </Grid>

          <TeamScoreControl 
            team={awayTeam?.name}
            logo={awayTeam?.image_path}
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

export default Predictiontest;