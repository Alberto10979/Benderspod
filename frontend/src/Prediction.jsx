import { useQuery } from '@tanstack/react-query';
import './Prediction.css';
import { useState } from 'react';

const API_KEY = 'IvOJhEFE9CXW8pzcRqpvJfY1fjRMH1ZE6shazIm90B6vwhufLmqTzn1H76uT';

const fetchMatchData = async () => {
  try {
    // Using a CORS proxy for development (replace with your own in production)
    const proxyUrl = 'https://corsproxy.io/?';
    const apiUrl = `https://api.sportmonks.com/v3/football/fixtures/19427463?include=participants;league;venue;state;scores;events.type;events.period;events.player;predictions.type&api_token=${API_KEY}`;
    
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data) {
      throw new Error('Invalid API response format');
    }

    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Failed to load match data. Please try again later.');
  }
};

const Prediction = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['matchData'],
    queryFn: fetchMatchData,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false
  });

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading match data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <h3>⚠️ Error Loading Data</h3>
        <p>{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  const match = data.data;
  const homeTeam = match.participants.find(p => p.meta.location === 'home');
  const awayTeam = match.participants.find(p => p.meta.location === 'away');
  const league = match.league;
  const venue = match.venue;
  const resultPrediction = match.predictions?.find(p => p.type.name.includes('Fulltime Result'));

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleSubmitPrediction = () => {
    alert(`You predicted: ${homeTeam.name} ${homeScore}-${awayScore} ${awayTeam.name}`);
    // Here you would typically send the prediction to your backend
  };

  return (
    <div className="prediction-container">
      {league?.image_path && (
        <div className="league-info">
          <img 
            src={league.image_path} 
            alt={league.name} 
            className="league-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2>{league.name}</h2>
        </div>
      )}
      
      <div className="match-header">
        <div className="team home-team">
          {homeTeam?.image_path && (
            <img 
              src={homeTeam.image_path} 
              alt={homeTeam.name} 
              className="team-logo"
              onError={(e) => {
                e.target.src = '/default-team-logo.png';
              }}
            />
          )}
          <h2>{homeTeam?.name || 'Home Team'}</h2>
          
          <div className="score-input">
            {[0, 1, 2, 3, 4, 5].map(num => (
              <button 
                key={`home-${num}`} 
                className={`score-button ${homeScore === num ? 'active' : ''}`}
                onClick={() => setHomeScore(num)}
                aria-label={`Set home score to ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
          
          {resultPrediction?.predictions?.home && (
            <div className="prediction-percentage">
              <span className="percentage-label">Win chance:</span>
              <span className="percentage-value">
                {resultPrediction.predictions.home}%
              </span>
            </div>
          )}
        </div>

        <div className="match-center">
          <div className="vs">VS</div>
          <div className="match-time">
            <i className="icon-clock"></i>
            {formatDate(match.starting_at)}
          </div>
          
          {venue && (
            <div className="venue">
              <i className="icon-location"></i>
              <span>
                {venue.name}, {venue.city_name}
              </span>
            </div>
          )}
          
          {resultPrediction?.predictions?.draw && (
            <div className="draw-probability">
              <span className="probability-label">Draw:</span>
              <span className="probability-value">
                {resultPrediction.predictions.draw}%
              </span>
            </div>
          )}
        </div>

        <div className="team away-team">
          {awayTeam?.image_path && (
            <img 
              src={awayTeam.image_path} 
              alt={awayTeam.name} 
              className="team-logo"
              onError={(e) => {
                e.target.src = '/default-team-logo.png';
              }}
            />
          )}
          <h2>{awayTeam?.name || 'Away Team'}</h2>
          
          <div className="score-input">
            {[0, 1, 2, 3, 4, 5].map(num => (
              <button 
                key={`away-${num}`} 
                className={`score-button ${awayScore === num ? 'active' : ''}`}
                onClick={() => setAwayScore(num)}
                aria-label={`Set away score to ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
          
          {resultPrediction?.predictions?.away && (
            <div className="prediction-percentage">
              <span className="percentage-label">Win chance:</span>
              <span className="percentage-value">
                {resultPrediction.predictions.away}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="prediction-actions">
        <button 
          className="submit-prediction"
          onClick={handleSubmitPrediction}
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Prediction'}
        </button>
      </div>

      {match.predictions?.length > 0 && (
        <div className="additional-stats">
          <h3>
            <i className="icon-stats"></i>
            Match Statistics
          </h3>
          <div className="stats-grid">
            {match.predictions
              .filter(pred => pred.type && !pred.type.name.includes('Fulltime Result'))
              .map(pred => (
                <div key={pred.type.id} className="stat-card">
                  <h4 className="stat-title">
                    {pred.type.name}
                  </h4>
                  <ul className="stat-list">
                    {Object.entries(pred.predictions).map(([key, value]) => (
                      <li key={key} className="stat-item">
                        <span className="stat-name">{key}:</span>
                        <span className="stat-value">{value}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prediction;