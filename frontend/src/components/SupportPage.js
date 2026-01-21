import React, { useState, useEffect } from 'react';
import { getSupportServices, getCategories } from '../services/supportService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const SupportPage = ({ language }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const brandColor = '#0F6CBF';
  const categories = getCategories();

  const translations = {
    en: {
      title: 'Support Services',
      subtitle: 'TU Darmstadt resources to help you succeed',
      allCategories: 'All Services',
      contact: 'Contact',
      email: 'Email',
      phone: 'Phone',
      hours: 'Office Hours',
      location: 'Location',
      visitWebsite: 'Visit Website',
      noServices: 'No services found in this category',
    },
    de: {
      title: 'Hilfsangebote',
      subtitle: 'TU Darmstadt Ressourcen fur Ihren Erfolg',
      allCategories: 'Alle Angebote',
      contact: 'Kontakt',
      email: 'E-Mail',
      phone: 'Telefon',
      hours: 'Sprechzeiten',
      location: 'Standort',
      visitWebsite: 'Webseite besuchen',
      noServices: 'Keine Angebote in dieser Kategorie gefunden',
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSupportServices();
      setServices(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colorMap = {
      academic: '#0F6CBF',
      career: '#28a745',
      counseling: '#e83e8c',
      administrative: '#6c757d',
      financial: '#ffc107',
      health: '#dc3545',
      international: '#17a2b8',
      other: '#6f42c1',
    };
    return colorMap[category] || '#6c757d';
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <ErrorMessage message={error} onRetry={loadServices} />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>{t.title}</h1>
        <p style={styles.subtitle}>{t.subtitle}</p>
      </div>

      {/* Category Filter */}
      <div style={styles.categoryFilter}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            ...styles.categoryButton,
            backgroundColor: selectedCategory === 'all' ? brandColor : 'white',
            color: selectedCategory === 'all' ? 'white' : '#333',
          }}
        >
          {t.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            style={{
              ...styles.categoryButton,
              backgroundColor: selectedCategory === cat.value ? getCategoryColor(cat.value) : 'white',
              color: selectedCategory === cat.value ? 'white' : '#333',
              borderColor: getCategoryColor(cat.value),
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div style={styles.servicesGrid}>
        {filteredServices.length === 0 ? (
          <div style={styles.emptyState}>
            <p>{t.noServices}</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              style={{
                ...styles.serviceCard,
                borderTop: `4px solid ${getCategoryColor(service.category)}`,
              }}
            >
              {/* Category Badge */}
              <span style={{
                ...styles.categoryBadge,
                backgroundColor: `${getCategoryColor(service.category)}20`,
                color: getCategoryColor(service.category),
              }}>
                {categories.find(c => c.value === service.category)?.label || service.category}
              </span>

              {/* Service Name */}
              <h3 style={styles.serviceName}>{service.name}</h3>

              {/* Description */}
              <p style={styles.serviceDescription}>{service.description}</p>

              {/* Contact Info */}
              <div style={styles.contactSection}>
                <h4 style={styles.contactTitle}>{t.contact}</h4>

                {service.contactInfo?.email && (
                  <div style={styles.contactRow}>
                    <span style={styles.contactLabel}>{t.email}:</span>
                    <a href={`mailto:${service.contactInfo.email}`} style={styles.contactLink}>
                      {service.contactInfo.email}
                    </a>
                  </div>
                )}

                {service.contactInfo?.phone && (
                  <div style={styles.contactRow}>
                    <span style={styles.contactLabel}>{t.phone}:</span>
                    <a href={`tel:${service.contactInfo.phone}`} style={styles.contactLink}>
                      {service.contactInfo.phone}
                    </a>
                  </div>
                )}

                {service.contactInfo?.officeHours && (
                  <div style={styles.contactRow}>
                    <span style={styles.contactLabel}>{t.hours}:</span>
                    <span style={styles.contactValue}>{service.contactInfo.officeHours}</span>
                  </div>
                )}

                {service.location && (
                  <div style={styles.contactRow}>
                    <span style={styles.contactLabel}>{t.location}:</span>
                    <span style={styles.contactValue}>{service.location}</span>
                  </div>
                )}
              </div>

              {/* Website Button */}
              {service.url && (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...styles.websiteButton,
                    backgroundColor: getCategoryColor(service.category),
                  }}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  {t.visitWebsite}
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  categoryFilter: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  categoryButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  servicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  serviceName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    margin: '0 0 12px 0',
  },
  serviceDescription: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
    flex: 1,
  },
  contactSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
  },
  contactTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 12px 0',
  },
  contactRow: {
    display: 'flex',
    fontSize: '13px',
    marginBottom: '8px',
  },
  contactLabel: {
    fontWeight: '500',
    color: '#666',
    minWidth: '80px',
  },
  contactValue: {
    color: '#333',
  },
  contactLink: {
    color: '#0F6CBF',
    textDecoration: 'none',
  },
  websiteButton: {
    display: 'block',
    textAlign: 'center',
    padding: '12px 20px',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'opacity 0.2s',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '8px',
  },
};

export default SupportPage;
