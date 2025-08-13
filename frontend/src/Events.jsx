import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/events/all/');
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLearnMore = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="events-container">
      <h1 className="events-header">Benderspod Events</h1>
      
      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            {event.image && (
              <div className="event-image-container">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="event-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-event.jpg';
                  }}
                />
              </div>
            )}
            
            <div className="event-content">
              <h2 className="event-title">{event.title}</h2>
              <div className="event-meta">
                <span className="event-date">
                  {format(new Date(event.date), 'MMMM do, yyyy - h:mm a')}
                </span>
                <span className="event-location">{event.location}</span>
              </div>
              <p className="event-description">{event.description.substring(0, 100)}...</p>
              <button 
                className="event-button"
                onClick={() => handleLearnMore(event)}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="event-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
            
            <div className="modal-image-container">
              <img 
                src={selectedEvent.image || '/placeholder-event.jpg'} 
                alt={selectedEvent.title}
                className="modal-image"
              />
            </div>
            
            <div className="modal-details">
              <h2>{selectedEvent.title}</h2>
              <div className="modal-meta">
               
                <p><strong>Location:</strong> {selectedEvent.location}</p>
              </div>
              <div className="modal-description">
                <p>{selectedEvent.description}</p>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;