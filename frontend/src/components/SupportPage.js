import React, { useState, useEffect } from 'react';
import careerOfferService from '../services/careerOfferService';

const CATEGORIES = [
  { key: 'all' },
  { key: 'studienerfolg', de: 'Studienerfolg', en: 'Study Success', icon: '\uD83C\uDF93', color: '#e67e22', lightBg: '#fef5e7' },
  { key: 'berufseinstieg', de: 'Berufseinstieg', en: 'Career Entry', icon: '\uD83D\uDE80', color: '#27ae60', lightBg: '#eafaf1' },
  { key: 'integration', de: 'Integration & Sprache', en: 'Integration & Language', icon: '\uD83C\uDF0D', color: '#8e44ad', lightBg: '#f4ecf7' },
];

const SupportPage = ({ language = 'de' }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await careerOfferService.getCareerOffers();
        const items = Array.isArray(data) ? data : (data.results || []);
        setOffers(items);
        setError(null);
      } catch (err) {
        setError(err.message);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const t = language === 'de' ? {
    title: 'Support & Ressourcen',
    subtitle: 'Deine Anlaufstellen an der TU Darmstadt',
    searchPlaceholder: 'Angebote durchsuchen...',
    allLabel: 'Alle',
    noResults: 'Keine Ergebnisse gefunden.',
    clearSearch: 'Suche l\u00f6schen',
    website: 'Webseite',
    email: 'E-Mail',
    provider: 'Anbieter',
    loading: 'Lade Angebote...',
    error: 'Fehler beim Laden.',
    retry: 'Erneut versuchen',
    results: 'Ergebnisse',
  } : {
    title: 'Support & Resources',
    subtitle: 'Your contact points at TU Darmstadt',
    searchPlaceholder: 'Search resources...',
    allLabel: 'All',
    noResults: 'No results found.',
    clearSearch: 'Clear search',
    website: 'Website',
    email: 'Email',
    provider: 'Provider',
    loading: 'Loading resources...',
    error: 'Failed to load.',
    retry: 'Retry',
    results: 'results',
  };

  const filtered = offers.filter(o => {
    const matchesCat = activeCategory === 'all' || o.category === activeCategory;
    if (!matchesCat) return false;
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const title = (language === 'de' ? o.title_de : o.title_en).toLowerCase();
    const desc = (language === 'de' ? o.description_de : o.description_en).toLowerCase();
    const prov = o.provider.toLowerCase();
    return title.includes(q) || desc.includes(q) || prov.includes(q);
  });

  const grouped = {
    studienerfolg: filtered.filter(o => o.category === 'studienerfolg'),
    berufseinstieg: filtered.filter(o => o.category === 'berufseinstieg'),
    integration: filtered.filter(o => o.category === 'integration'),
  };

  const getCat = (key) => CATEGORIES.find(c => c.key === key);

  // Loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px', animation: 'spin 1s linear infinite' }}>&#9696;</div>
          <p style={{ fontSize: '16px', margin: 0 }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#9888;&#65039;</div>
        <p style={{ color: '#e74c3c', fontSize: '16px', margin: '0 0 20px 0' }}>{t.error}</p>
        <button onClick={() => window.location.reload()} style={{ padding: '10px 28px', backgroundColor: '#004E8A', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>{t.retry}</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 6px 0', fontSize: '26px', color: '#1a1a2e', fontWeight: '700' }}>{t.title}</h1>
        <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>{t.subtitle}</p>
      </div>

      {/* Search + Filters row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '360px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: '#999', pointerEvents: 'none' }}>&#128269;</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              border: '2px solid #e0e0e0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box',
              backgroundColor: 'white',
            }}
            onFocus={(e) => e.target.style.borderColor = '#004E8A'}
            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#999', padding: '2px' }}
            >&#10005;</button>
          )}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.key;
            const count = cat.key === 'all' ? offers.length : offers.filter(o => o.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: isActive ? (cat.color || '#004E8A') : '#f0f0f0',
                  color: isActive ? 'white' : '#555',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.icon && <span style={{ fontSize: '14px' }}>{cat.icon}</span>}
                {cat.key === 'all' ? t.allLabel : (language === 'de' ? cat.de : cat.en)}
                <span style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.08)',
                  padding: '1px 7px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: '700',
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count when searching */}
      {searchTerm && (
        <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#888' }}>
          {filtered.length} {t.results}
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ marginLeft: '10px', background: 'none', border: 'none', color: '#004E8A', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textDecoration: 'underline' }}>{t.clearSearch}</button>
          )}
        </p>
      )}

      {/* No results */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.4 }}>&#128270;</div>
          <p style={{ color: '#888', fontSize: '16px', margin: '0 0 12px 0' }}>{t.noResults}</p>
          <button onClick={() => { setSearchTerm(''); setActiveCategory('all'); }} style={{ background: 'none', border: 'none', color: '#004E8A', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>{t.clearSearch}</button>
        </div>
      )}

      {/* Content sections */}
      {activeCategory === 'all' ? (
        ['studienerfolg', 'berufseinstieg', 'integration'].map(key => {
          const items = grouped[key];
          if (!items || items.length === 0) return null;
          return <CategorySection key={key} catKey={key} items={items} language={language} t={t} getCat={getCat} />;
        })
      ) : (
        filtered.length > 0 && <CategorySection catKey={activeCategory} items={filtered} language={language} t={t} getCat={getCat} />
      )}
    </div>
  );
};

/* ---------- Category Section ---------- */
const CategorySection = ({ catKey, items, language, t, getCat }) => {
  const cat = getCat(catKey);
  if (!cat) return null;

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>{cat.icon}</span>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#1a1a2e', fontWeight: '700' }}>
          {language === 'de' ? cat.de : cat.en}
        </h2>
        <span style={{ fontSize: '12px', backgroundColor: cat.lightBg, color: cat.color, padding: '3px 10px', borderRadius: '10px', fontWeight: '700' }}>{items.length}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
        {items.map(offer => (
          <ResourceCard key={offer.id} offer={offer} language={language} cat={cat} t={t} />
        ))}
      </div>
    </div>
  );
};

/* ---------- Resource Card ---------- */
const ResourceCard = ({ offer, language, cat, t }) => {
  const title = language === 'de' ? offer.title_de : offer.title_en;
  const description = language === 'de' ? offer.description_de : offer.description_en;
  const hasLinks = offer.links && offer.links.length > 0;
  const hasEmails = offer.contact_emails && offer.contact_emails.length > 0;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        borderLeft: `4px solid ${cat.color}`,
        padding: '20px 20px 16px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Title */}
      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '700', color: '#1a1a2e', lineHeight: '1.35' }}>{title}</h3>

      {/* Provider */}
      <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#888', fontWeight: '500' }}>{offer.provider}</p>

      {/* Description */}
      <p style={{ margin: '0 0 14px 0', fontSize: '13.5px', color: '#4a4a4a', lineHeight: '1.55', flex: 1 }}>{description}</p>

      {/* Actions row */}
      {(hasLinks || hasEmails) && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
          {hasLinks && offer.links.map((link, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                backgroundColor: cat.color,
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: '600',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <span style={{ fontSize: '13px' }}>&#8599;</span>
              {t.website}
            </a>
          ))}
          {hasEmails && offer.contact_emails.map((email, idx) => (
            <a
              key={idx}
              href={`mailto:${email}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 14px',
                backgroundColor: cat.lightBg,
                color: cat.color,
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '12.5px',
                fontWeight: '600',
                border: `1px solid ${cat.color}30`,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${cat.color}18`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = cat.lightBg}
            >
              <span style={{ fontSize: '13px' }}>&#9993;</span>
              {email}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportPage;
