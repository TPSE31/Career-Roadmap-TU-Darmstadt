import React, { useState } from 'react';

const LoginPage = ({ onLogin, onSignup, language, onToggleLanguage }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState('');

  const brandColor = '#0F6CBF';

  const validatePassword = (pwd) => {
    if (pwd.length < 8) {
      return language === 'en' 
        ? 'Password must be at least 8 characters' 
        : 'Passwort muss mindestens 8 Zeichen lang sein';
    }
    if (!/[A-Z]/.test(pwd)) {
      return language === 'en'
        ? 'Password must contain at least one uppercase letter'
        : 'Passwort muss mindestens einen Großbuchstaben enthalten';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return language === 'en'
        ? 'Password must contain at least one special character'
        : 'Passwort muss mindestens ein Sonderzeichen enthalten';
    }
    return '';
  };

  const validateStudentId = (id) => {
    if (id.length > 7) {
      return language === 'en'
        ? 'Student ID cannot be more than 7 digits'
        : 'Studenten-ID darf nicht mehr als 7 Ziffern haben';
    }
    if (!/^\d+$/.test(id)) {
      return language === 'en'
        ? 'Student ID must contain only numbers'
        : 'Studenten-ID darf nur Zahlen enthalten';
    }
    return '';
  };

  const translations = {
    en: {
      welcome: 'Welcome to Career Roadmap',
      subtitle: 'Your academic journey planner',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      studentId: 'Student ID',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      loginButton: 'Login',
      signupButton: 'Create Account',
    },
    de: {
      welcome: 'Willkommen bei Career Roadmap',
      subtitle: 'Ihr akademischer Reiseplaner',
      login: 'Anmelden',
      signup: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      name: 'Vollständiger Name',
      studentId: 'Studenten-ID',
      noAccount: 'Noch kein Konto?',
      haveAccount: 'Haben Sie bereits ein Konto?',
      loginButton: 'Anmelden',
      signupButton: 'Konto erstellen',
    }
  };

  const t = translations[language];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    // Validate student ID for signup
    if (isSignup) {
      const studentIdError = validateStudentId(studentId);
      if (studentIdError) {
        setError(studentIdError);
        return;
      }
      onSignup(email, password, name, studentId);
    } else {
      onLogin(email, password);
    }
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
      {/* Language Toggle - Top Right */}
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
        {language === 'en' ? '🇬🇧 English' : '🇩🇪 Deutsch'}
      </button>

      {/* Login/Signup Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '50px',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src="/logo.png" alt="Career Roadmap" style={{ height: '80px', marginBottom: '20px' }} />
          <h1 style={{ margin: '10px 0', color: brandColor, fontSize: '28px' }}>
            {t.welcome}
          </h1>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
            {t.subtitle}
          </p>
        </div>

        {/* Form */}
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
          
          {isSignup && (
            <>
              <input
                type="text"
                placeholder={t.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: '15px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = brandColor}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <input
                type="text"
                placeholder={t.studentId}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                maxLength="7"
                required
                style={{
                  width: '100%',
                  padding: '14px',
                  marginBottom: '15px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = brandColor}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </>
          )}

          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '15px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = brandColor}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />

          <input
            type="password"
            placeholder={t.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = brandColor}
            onBlur={(e) => e.target.style.borderColor = '#ddd'}
          />

          <button
            type="submit"
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
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0a4a8a'}
            onMouseLeave={(e) => e.target.style.backgroundColor = brandColor}
          >
            {isSignup ? t.signupButton : t.loginButton}
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {isSignup ? t.haveAccount : t.noAccount}
            <span
              onClick={() => setIsSignup(!isSignup)}
              style={{
                color: brandColor,
                fontWeight: 'bold',
                marginLeft: '5px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isSignup ? t.login : t.signup}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
