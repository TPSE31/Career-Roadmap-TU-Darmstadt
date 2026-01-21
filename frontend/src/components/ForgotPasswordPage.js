import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/authService';

const ForgotPasswordPage = ({ language, onToggleLanguage }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resetLink, setResetLink] = useState(null); // For test mode when EmailJS not configured
  const [emailSent, setEmailSent] = useState(false); // True when real email was sent

  const brandColor = '#0F6CBF';

  const translations = {
    en: {
      title: 'Forgot Password',
      subtitle: 'Enter your email address and we will send you a link to reset your password.',
      email: 'Email Address',
      sendButton: 'Send Reset Link',
      sending: 'Sending...',
      backToLogin: 'Back to Login',
      successTitle: 'Check Your Email',
      successMessage: 'If an account exists with this email, you will receive a password reset link shortly.',
      emailRequired: 'Please enter your email address',
      invalidEmail: 'Please enter a valid email address',
      mockModeNote: 'Test Mode: Click the link below to reset your password',
      noAccountFound: 'No account found with this email address.',
      resetLinkButton: 'Reset Password',
      emailSentTitle: 'Email Sent!',
      emailSentMessage: 'We have sent a password reset link to your email address. Please check your inbox and spam folder.',
    },
    de: {
      title: 'Passwort vergessen',
      subtitle: 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.',
      email: 'E-Mail-Adresse',
      sendButton: 'Link senden',
      sending: 'Wird gesendet...',
      backToLogin: 'Zurück zur Anmeldung',
      successTitle: 'E-Mail prüfen',
      successMessage: 'Falls ein Konto mit dieser E-Mail existiert, erhalten Sie in Kürze einen Link zum Zurücksetzen des Passworts.',
      emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein',
      invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      mockModeNote: 'Testmodus: Klicken Sie auf den Link unten, um Ihr Passwort zurückzusetzen',
      noAccountFound: 'Kein Konto mit dieser E-Mail-Adresse gefunden.',
      resetLinkButton: 'Passwort zurücksetzen',
      emailSentTitle: 'E-Mail gesendet!',
      emailSentMessage: 'Wir haben einen Link zum Zurücksetzen des Passworts an Ihre E-Mail-Adresse gesendet. Bitte überprüfen Sie Ihren Posteingang und Spam-Ordner.',
    }
  };

  const t = translations[language];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t.emailRequired);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.invalidEmail);
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestPasswordReset(email);
      setSuccess(true);

      // Check if real email was sent
      if (result.emailSent) {
        setEmailSent(true);
      }
      // If EmailJS not configured, we get the reset link back for testing
      else if (result.mockResetLink) {
        setResetLink(result.mockResetLink);
      }
    } catch (err) {
      // Don't reveal whether email exists for security reasons
      // Still show success to prevent email enumeration
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    marginBottom: '15px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    opacity: isLoading ? 0.7 : 1,
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: brandColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Language Toggle */}
      <button
        onClick={onToggleLanguage}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 16px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: 'white',
          border: '2px solid white',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
      >
        {language === 'en' ? 'EN' : 'DE'}
      </button>

      {/* Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="Career Roadmap" style={{ height: '80px', marginBottom: '20px' }} />
          <h1 style={{ margin: '10px 0', color: brandColor, fontSize: '28px' }}>
            {success ? (emailSent ? t.emailSentTitle : t.successTitle) : t.title}
          </h1>
          <p style={{ color: '#666', fontSize: '16px', margin: 0, lineHeight: '1.5' }}>
            {success ? (emailSent ? t.emailSentMessage : t.successMessage) : t.subtitle}
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '6px',
                color: '#c33',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <input
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = brandColor}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: isLoading ? '#ccc' : brandColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginBottom: '15px',
              }}
            >
              {isLoading ? t.sending : t.sendButton}
            </button>
          </form>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '20px 0',
          }}>
            {/* Show checkmark for email sent, envelope for test mode */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: emailSent ? '#d4edda' : '#e8f4fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              {emailSent ? (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2">
                  <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2" />
                  <path d="M22 6l-10 7L2 6" />
                  <path d="M2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6" />
                </svg>
              )}
            </div>

            {/* Test Mode: Show reset link when EmailJS is not configured */}
            {resetLink && !emailSent && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#e8f4fd',
                borderRadius: '8px',
                border: `1px solid ${brandColor}`,
              }}>
                <p style={{
                  color: brandColor,
                  fontSize: '14px',
                  fontWeight: 'bold',
                  margin: '0 0 10px 0',
                }}>
                  {t.mockModeNote}
                </p>
                <Link
                  to={resetLink.replace(window.location.origin, '')}
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: brandColor,
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                >
                  {t.resetLinkButton}
                </Link>
              </div>
            )}

            {/* No account found message (only when no link and no email sent) */}
            {!resetLink && !emailSent && (
              <p style={{
                color: '#999',
                fontSize: '14px',
                marginTop: '10px',
              }}>
                {t.noAccountFound}
              </p>
            )}
          </div>
        )}

        {/* Back to Login Link */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Link
            to="/login"
            style={{
              color: brandColor,
              fontWeight: 'bold',
              textDecoration: 'underline',
              fontSize: '14px',
            }}
          >
            {t.backToLogin}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
