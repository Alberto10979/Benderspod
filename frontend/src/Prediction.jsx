import { useEffect, useMemo, useState } from 'react';
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

const Prediction = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);
  const [selectedFixtureId, setSelectedFixtureId] = useState('');
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [motmPlayerId, setMotmPlayerId] = useState('');
  const [username, setUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const selectedFixture = useMemo(
    () => fixtures.find(f => String(f.id) === String(selectedFixtureId)),
    [fixtures, selectedFixtureId]
  );

  const teams = useMemo(() => {
    if (!selectedFixture) return null;
    return {
      home: { name: selectedFixture.home_team.name, logo: selectedFixture.home_team.logo_url },
      away: { name: selectedFixture.away_team.name, logo: selectedFixture.away_team.logo_url }
    };
  }, [selectedFixture]);

  // Load fixtures from backend
  useEffect(() => {
    const loadFixtures = async () => {
      setLoadingFixtures(true);
      try {
        const res = await fetch('/api/fixtures/');
        if (!res.ok) throw new Error('Failed to fetch fixtures');
        const data = await res.json();
        setFixtures(data);
      } catch (e) {
        setSnackbar({ open: true, message: 'Error loading fixtures', severity: 'error' });
      } finally {
        setLoadingFixtures(false);
      }
    };
    loadFixtures();
  }, []);

  // Load players for selected fixture
  useEffect(() => {
    const loadPlayers = async () => {
      if (!selectedFixtureId) return;
      setLoadingPlayers(true);
      try {
        const res = await fetch(`/api/fixtures/${selectedFixtureId}/players/`);
        if (!res.ok) throw new Error('Failed to fetch players');
        const data = await res.json();
        setPlayers(data);
      } catch (e) {
        setSnackbar({ open: true, message: 'Error loading players', severity: 'error' });
      } finally {
        setLoadingPlayers(false);
      }
    };
    setPlayers([]);
    setMotmPlayerId('');
    setHomeScore(0);
    setAwayScore(0);
    loadPlayers();
  }, [selectedFixtureId]);

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
    if (!username.trim()) {
      setSnackbar({ open: true, message: 'Please enter your name', severity: 'error' });
      return;
    }
    if (!selectedFixtureId) {
      setSnackbar({ open: true, message: 'Please select a fixture', severity: 'error' });
      return;
    }
    if (motmPlayerId === '') {
      setSnackbar({ open: true, message: 'Please select Man of the Match', severity: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/submitprediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          fixture: selectedFixtureId,
          home_score: homeScore,
          away_score: awayScore,
          man_of_the_match: motmPlayerId
        }),
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'Prediction submitted successfully!', severity: 'success' });
        // Reset
        setHomeScore(0);
        setAwayScore(0);
        setUsername('');
        setMotmPlayerId('');
        setSelectedFixtureId('');
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || 'Failed to submit prediction');
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message || 'Error submitting prediction', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => setSnackbar(s => ({ ...s, open: false }));

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(to bottom, #f3e5f5, #ffffff)' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 1 }}>
            Benderspod Match Prediction
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Choose a fixture, set scores, and pick Man of the Match.
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'secondary.light', mb: 3 }} />

        {/* Fixture Select */}
        <Box sx={{ mb: 3 }}>
          <TextField
            select
            SelectProps={{ native: true }}
            fullWidth
            label={loadingFixtures ? 'Loading fixtures...' : 'Select Fixture'}
            value={selectedFixtureId}
            onChange={(e) => setSelectedFixtureId(e.target.value)}
            disabled={loadingFixtures}
            helperText="Fixtures are added by admins."
          >
            <option value="" disabled>-- select --</option>
            {fixtures.map(f => (
              <option key={f.id} value={f.id}>
                {f.home_team.name} vs {f.away_team.name} — {new Date(f.kickoff_at).toLocaleString()}
              </option>
            ))}
          </TextField>
        </Box>

        {/* Score Controls */}
        {teams ? (
          <>
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
            <Box sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'secondary.light', borderRadius: 1, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>Your Prediction:</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                {homeScore} - {awayScore}
              </Typography>
            </Box>

            {/* Man of the Match */}
            <Box sx={{ mb: 3 }}>
              <TextField
                select
                SelectProps={{ native: true }}
                fullWidth
                label={loadingPlayers ? 'Loading players...' : 'Man of the Match'}
                value={motmPlayerId}
                onChange={(e) => setMotmPlayerId(e.target.value)}
                disabled={loadingPlayers || !selectedFixtureId}
                helperText={selectedFixture ? `${selectedFixture.home_team.name} & ${selectedFixture.away_team.name} players` : ''}
              >
                <option value="" disabled>-- select player --</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.team.name})
                  </option>
                ))}
              </TextField>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Select a fixture to begin</Typography>
          </Box>
        )}

        {/* Name */}
        <TextField
          fullWidth
          label="Your Name"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            sx: {
              '& fieldset': { borderColor: 'secondary.light' },
              '&:hover fieldset': { borderColor: 'secondary.main' },
            }
          }}
        />

        {/* Submit */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          sx={{ py: 1.5, borderRadius: 2, fontSize: '1.1rem', bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
          disabled={!selectedFixtureId}
        >
          Submit Prediction
        </Button>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%', bgcolor: snackbar.severity === 'error' ? 'error.light' : 'success.light' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Prediction;
