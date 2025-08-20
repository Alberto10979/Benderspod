import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Partners.css';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        const endpoint = selectedType === 'all' 
          ? 'https://benderspod-production-1776.up.railway.app/api/partners/'
          : `https://benderspod-production-1776.up.railway.app/api/partners/${selectedType}/`;
        
        const response = await axios.get(endpoint);
        setPartners(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPartners();
  }, [selectedType]);

  // Function to construct the full logo URL
  const getLogoUrl = (logoPath) => {
    if (!logoPath) return '/placeholder-partner.png';
    
    // If it's already a full URL, return as is
    if (logoPath.startsWith('http')) return logoPath;
    
    // Otherwise, construct the full URL using your API base
    return `https://benderspod-production-1776.up.railway.app${logoPath}`;
  };

  const partnerTypes = [
    { value: 'all', label: 'All Partners' },
    { value: 'sponsor', label: 'Sponsors' },
    { value: 'media', label: 'Media Partners' },
    { value: 'community', label: 'Community Partners' },
    { value: 'technology', label: 'Technology Partners' },
  ];

  if (loading) return (
    <div className="partners-container">
      <div className="loading-spinner"></div>
    </div>
  );
  
  if (error) return (
    <div className="partners-container">
      <div className="error-message">Error: {error}</div>
    </div>
  );

  return (
    <div className="partners-container">
      <h1 className="partners-header">Our Partners</h1>
      
      <div className="partner-filter">
        {partnerTypes.map(type => (
          <button
            key={type.value}
            className={`filter-btn ${selectedType === type.value ? 'active' : ''}`}
            onClick={() => setSelectedType(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>

      <div className="partners-grid">
        {partners.map(partner => (
          <div key={partner.id} className="partner-card">
            <div className="partner-logo-container">
              <img 
                src={getLogoUrl(partner.logo_url)} 
                alt={partner.name}
                className="partner-logo"
                onError={(e) => {
                  e.target.src = '/placeholder-partner.png';
                }}
              />
            </div>
            
            <div className="partner-content">
              <h3 className="partner-name">{partner.name}</h3>
              <p className="partner-type">{partner.partner_type}</p>
              <p className="partner-description">{partner.description}</p>
              
              {partner.website && (
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="partner-website"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && !loading && (
        <div className="no-partners">
          <p>No partners found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Partners;