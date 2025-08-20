import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Partners.css';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Function to open modal with partner details
  const openPartnerModal = (partner) => {
    setSelectedPartner(partner);
    setIsModalOpen(true);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  // Function to close modal
  const closePartnerModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  // Close modal when clicking outside content
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closePartnerModal();
    }
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
          <div 
            key={partner.id} 
            className="partner-card"
            onClick={() => openPartnerModal(partner)}
          >
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
              <p className="partner-description">
                {partner.description.length > 150 
                  ? `${partner.description.substring(0, 150)}...` 
                  : partner.description
                }
                {partner.description.length > 150 && (
                  <span className="read-more">Read more</span>
                )}
              </p>
              
              {partner.website && (
                <a 
                  href={partner.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="partner-website"
                  onClick={(e) => e.stopPropagation()}
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

      {/* Partner Details Modal */}
      {isModalOpen && selectedPartner && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal-content">
            <button className="modal-close" onClick={closePartnerModal}>
              &times;
            </button>
            
            <div className="modal-header">
              <div className="modal-logo-container">
                <img 
                  src={getLogoUrl(selectedPartner.logo_url)} 
                  alt={selectedPartner.name}
                  className="modal-logo"
                  onError={(e) => {
                    e.target.src = '/placeholder-partner.png';
                  }}
                />
              </div>
              <div className="modal-title">
                <h2>{selectedPartner.name}</h2>
                <p className="modal-partner-type">{selectedPartner.partner_type}</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-description">
                <h3>About</h3>
                <p>{selectedPartner.description}</p>
              </div>

              {selectedPartner.website && (
                <div className="modal-website">
                  <a 
                    href={selectedPartner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="modal-website-link"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Partners;