import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../services/authService';

const ResetPasswordPage = ({ language, onToggleLanguage }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const token = searchParams.get('token');
  const brandColor = '#0F6CBF';

  const translations = {
    en: {
      title: 'Reset Password',
      subtitle: 'Enter your new password below.',
      password: 'New Password',
      confirmPassword: 'Confirm Password',
      resetButton: 'Reset Password',
      resetting: 'Resetting...',
      backToLogin: 'Back to Login',
      successTitle: 'Password Reset Successful',
      successMessage: 'Your password has been reset successfully. You can now log in with your new password.',
      loginButton: 'Go to Login',
      invalidToken: 'Invalid or expired reset link. Please request a new password reset.',
      passwordMismatch: 'Passwords do not match',
      passwordRequired: 'Please enter a new password',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordUppercase: 'Password must contain at least one uppercase letter',
      passwordSpecial: 'Password must contain at least one special character',
      validating: 'Validating reset link...',
    },
    de: {
      title: 'Passwort zurücksetzen',
      subtitle: 'Geben Sie unten Ihr neues Passwort ein.',
      password: 'Neues Passwort',
      confirmPassword: 'Passwort bestätigen',
      resetButton: 'Passwort zurücksetzen',
      resetting: 'Wird zurückgesetzt...',
      backToLogin: 'Zurück zur Anmeldung',
      successTitle: 'Passwort erfolgreich zurückgesetzt',
      successMessage: 'Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich jetzt mit Ihrem neuen Passwort anmelden.',
      loginButton: 'Zur Anmeldung',
      invalidToken: 'Ungültiger oder abgelaufener Link. Bitte fordern Sie einen neuen Passwort-Reset an.',
      passwordMismatch: 'Passwörter stimmen nicht überein',
      passwordRequired: 'Bitte geben Sie ein neues Passwort ein',
      passwordMinLength: 'Passwort muss mindestens 8 Zeichen lang sein',
      passwordUppercase: 'Passwort muss mindestens einen Großbuchstaben enthalten',
      passwordSpecial: 'Passwort muss mindestens ein Sonderzeichen enthalten',
      validating: 'Link wird überprüft...',
    }
  };

  const t = translations[language];

  // Validate token on mount
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenValid(false);
        setIsValidating(false);
        return;
      }

      try {
        await validateResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkToken();
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return t.passwordMinLength;
    }
    if (!/[A-Z]/.test(pwd)) {
      return t.passwordUppercase;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return t.passwordSpecial;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError(t.passwordRequired);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || t.invalidToken);
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

  // Show loading while validating token
  if (isValidating) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: brandColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          maxWidth: '450px',
          width: '90%',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${brandColor}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ color: '#666', fontSize: '16px' }}>{t.validating}</p>
          <style>
            {`@keyframes spin { to { transform: rotate(360deg); } }`}
          </style>
        </div>
      </div>
    );
  }

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
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="Career Roadmap" style={{ height: '80px', marginBottom: '20px' }} />

          {!tokenValid && !success ? (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#fee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c33" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p style={{ color: '#c33', fontSize: '16px', margin: 0, lineHeight: '1.5' }}>
                {t.invalidToken}
              </p>
            </>
          ) : success ? (
            <>
              <h1 style={{ margin: '10px 0', color: brandColor, fontSize: '28px' }}>
                {t.successTitle}
              </h1>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#e8f4fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '20px auto',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={brandColor} strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p style={{ color: '#666', fontSize: '16px', margin: 0, lineHeight: '1.5' }}>
                {t.successMessage}
              </p>
            </>
          ) : (
            <>
              <h1 style={{ margin: '10px 0', color: brandColor, fontSize: '28px' }}>
                {t.title}
              </h1>
              <p style={{ color: '#666', fontSize: '16px', margin: 0, lineHeight: '1.5' }}>
                {t.subtitle}
              </p>
            </>
          )}
        </div>

        {tokenValid && !success && (
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
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = brandColor}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />

            <input
              type="password"
              placeholder={t.confirmPassword}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              style={{...inputStyle, marginBottom: '20px'}}
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
              }}
            >
              {isLoading ? t.resetting : t.resetButton}
            </button>
          </form>
        )}

        {success && (
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: brandColor,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            {t.loginButton}
          </button>
        )}

        {/* Back to Login Link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
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

export default ResetPasswordPage;
