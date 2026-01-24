import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService, register as registerService } from '../services/authService';
import mockData from '../mocks/mockData';
import { getCareerGoalOptions } from '../services/userService';

const LoginPage = ({ language, onToggleLanguage }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [signupStep, setSignupStep] = useState(1); // 1: Basic Info, 2: Courses, 3: Career Goal

  // Basic info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [semester, setSemester] = useState(1);

  // Course selection
  const [completedModules, setCompletedModules] = useState([]);

  // Career goal
  const [careerGoal, setCareerGoal] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const brandColor = '#0F6CBF';
  const careerGoalOptions = getCareerGoalOptions();

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
      semester: 'Current Semester',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      loginButton: 'Login',
      signupButton: 'Create Account',
      loggingIn: 'Logging in...',
      signingUp: 'Creating account...',
      next: 'Next',
      back: 'Back',
      step1Title: 'Basic Information',
      step2Title: 'Select Completed Courses',
      step2Subtitle: 'Check the courses you have already passed',
      step3Title: 'Choose Your Career Goal',
      step3Subtitle: 'This helps us recommend the right electives',
      credits: 'Credits',
      selectedCredits: 'Selected Credits',
      skipForNow: 'Skip for now',
      forgotPassword: 'Forgot password?',
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
      semester: 'Aktuelles Semester',
      noAccount: 'Noch kein Konto?',
      haveAccount: 'Haben Sie bereits ein Konto?',
      loginButton: 'Anmelden',
      signupButton: 'Konto erstellen',
      loggingIn: 'Anmelden...',
      signingUp: 'Konto wird erstellt...',
      next: 'Weiter',
      back: 'Zurück',
      step1Title: 'Grundlegende Informationen',
      step2Title: 'Abgeschlossene Kurse auswählen',
      step2Subtitle: 'Markieren Sie die Kurse, die Sie bereits bestanden haben',
      step3Title: 'Wählen Sie Ihr Karriereziel',
      step3Subtitle: 'Dies hilft uns, die richtigen Wahlfächer zu empfehlen',
      credits: 'Credits',
      selectedCredits: 'Ausgewählte Credits',
      skipForNow: 'Später auswählen',
      forgotPassword: 'Passwort vergessen?',
    }
  };

  const t = translations[language];

  const handleModuleToggle = (moduleId) => {
    setCompletedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const calculateSelectedCredits = () => {
    return mockData.modules
      .filter(m => completedModules.includes(m.id))
      .reduce((sum, m) => sum + (m.credits || 0), 0);
  };

  const handleNextStep = () => {
    setError('');

    if (signupStep === 1) {
      // Validate step 1
      const passwordError = validatePassword(password);
      if (passwordError) {
        setError(passwordError);
        return;
      }
      const studentIdError = validateStudentId(studentId);
      if (studentIdError) {
        setError(studentIdError);
        return;
      }
      if (!name.trim()) {
        setError(language === 'en' ? 'Please enter your name' : 'Bitte geben Sie Ihren Namen ein');
        return;
      }
      if (!email.trim()) {
        setError(language === 'en' ? 'Please enter your email' : 'Bitte geben Sie Ihre E-Mail ein');
        return;
      }
    }

    setSignupStep(prev => prev + 1);
  };

  const handleBackStep = () => {
    setError('');
    setSignupStep(prev => prev - 1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Only validate that fields are not empty for login
    if (!email.trim() || !password.trim()) {
      setError(language === 'en' ? 'Please enter email and password' : 'Bitte E-Mail und Passwort eingeben');
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginService(email, password);
      login(result.user, result.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || (language === 'en' ? 'An error occurred' : 'Ein Fehler ist aufgetreten'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    setError('');
    setIsLoading(true);

    try {
      const nameParts = name.split(' ');
      const result = await registerService({
        email,
        password,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        matriculationNumber: studentId,
        semester: parseInt(semester),
        completedModules,
        careerGoal,
      });

      login(result.user, result.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || (language === 'en' ? 'An error occurred' : 'Ein Fehler ist aufgetreten'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSignupStep(1);
    setEmail('');
    setPassword('');
    setName('');
    setStudentId('');
    setSemester(1);
    setCompletedModules([]);
    setCareerGoal('');
    setError('');
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

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
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
        required
        disabled={isLoading}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = brandColor}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />

      <input
        type="password"
        placeholder={t.password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        style={{...inputStyle, marginBottom: '10px'}}
        onFocus={(e) => e.target.style.borderColor = brandColor}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />

      {/* Forgot Password Link */}
      <div style={{ textAlign: 'right', marginBottom: '15px' }}>
        <Link
          to="/forgot-password"
          style={{
            color: brandColor,
            fontSize: '14px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
        >
          {t.forgotPassword}
        </Link>
      </div>

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
        {isLoading ? t.loggingIn : t.loginButton}
      </button>
    </form>
  );

  const renderSignupStep1 = () => (
    <div>
      <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>{t.step1Title}</h3>

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
        type="text"
        placeholder={t.name}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={inputStyle}
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
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = brandColor}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />

      <input
        type="email"
        placeholder={t.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = brandColor}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />

      <input
        type="password"
        placeholder={t.password}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = brandColor}
        onBlur={(e) => e.target.style.borderColor = '#ddd'}
      />

      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        style={{...inputStyle, marginBottom: '20px'}}
      >
        {[1,2,3,4,5,6,7,8].map(s => (
          <option key={s} value={s}>{t.semester}: {s}</option>
        ))}
      </select>

      <button
        onClick={handleNextStep}
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
        }}
      >
        {t.next}
      </button>
    </div>
  );

  const renderSignupStep2 = () => (
    <div>
      <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{t.step2Title}</h3>
      <p style={{ color: '#666', margin: '0 0 15px 0', fontSize: '14px' }}>{t.step2Subtitle}</p>

      <div style={{
        backgroundColor: brandColor,
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontWeight: 'bold'
      }}>
        {t.selectedCredits}: {calculateSelectedCredits()} / 180
      </div>

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        {mockData.modules.map(module => (
          <label
            key={module.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              backgroundColor: completedModules.includes(module.id) ? '#e8f4fd' : 'white',
              transition: 'background-color 0.2s'
            }}
          >
            <input
              type="checkbox"
              checked={completedModules.includes(module.id)}
              onChange={() => handleModuleToggle(module.id)}
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                accentColor: brandColor
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '500', color: '#333' }}>{module.name}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {module.code} • {module.credits} {t.credits} • {module.category}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleBackStep}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: '#eee',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {t.back}
        </button>
        <button
          onClick={handleNextStep}
          style={{
            flex: 2,
            padding: '14px',
            backgroundColor: brandColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          {t.next}
        </button>
      </div>
    </div>
  );

  const renderSignupStep3 = () => (
    <div>
      <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{t.step3Title}</h3>
      <p style={{ color: '#666', margin: '0 0 20px 0', fontSize: '14px' }}>{t.step3Subtitle}</p>

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

      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        {careerGoalOptions.map(option => (
          <label
            key={option.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 15px',
              marginBottom: '8px',
              border: careerGoal === option.value ? `2px solid ${brandColor}` : '2px solid #ddd',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: careerGoal === option.value ? '#e8f4fd' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <input
              type="radio"
              name="careerGoal"
              value={option.value}
              checked={careerGoal === option.value}
              onChange={(e) => setCareerGoal(e.target.value)}
              style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                accentColor: brandColor
              }}
            />
            <span style={{ fontWeight: careerGoal === option.value ? '600' : '400' }}>
              {option.label}
            </span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleBackStep}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: '#eee',
            color: '#333',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {t.back}
        </button>
        <button
          onClick={handleSignup}
          disabled={isLoading}
          style={{
            flex: 2,
            padding: '14px',
            backgroundColor: isLoading ? '#ccc' : brandColor,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? t.signingUp : t.signupButton}
        </button>
      </div>

      {!careerGoal && (
        <button
          onClick={handleSignup}
          disabled={isLoading}
          style={{
            width: '100%',
            marginTop: '10px',
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {t.skipForNow}
        </button>
      )}
    </div>
  );

  // Progress indicator for signup
  const renderStepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '25px',
      gap: '8px'
    }}>
      {[1, 2, 3].map(step => (
        <div
          key={step}
          style={{
            width: step === signupStep ? '30px' : '10px',
            height: '10px',
            borderRadius: '5px',
            backgroundColor: step <= signupStep ? brandColor : '#ddd',
            transition: 'all 0.3s'
          }}
        />
      ))}
    </div>
  );

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
        maxWidth: isSignup && signupStep > 1 ? '500px' : '450px',
        width: '90%',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        transition: 'max-width 0.3s'
      }}>
        {/* Logo - only show on login or step 1 */}
        {(!isSignup || signupStep === 1) && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="/logo.png" alt="Career Roadmap" style={{ height: '80px', marginBottom: '20px' }} />
            <h1 style={{ margin: '10px 0', color: brandColor, fontSize: '28px' }}>
              {t.welcome}
            </h1>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              {t.subtitle}
            </p>
          </div>
        )}

        {/* Step indicator for signup */}
        {isSignup && renderStepIndicator()}

        {/* Forms */}
        {!isSignup && renderLoginForm()}
        {isSignup && signupStep === 1 && renderSignupStep1()}
        {isSignup && signupStep === 2 && renderSignupStep2()}
        {isSignup && signupStep === 3 && renderSignupStep3()}

        {/* Toggle Login/Signup */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '14px' }}>
            {isSignup ? t.haveAccount : t.noAccount}
            <span
              onClick={() => {
                if (!isLoading) {
                  setIsSignup(!isSignup);
                  resetForm();
                }
              }}
              style={{
                color: isLoading ? '#999' : brandColor,
                fontWeight: 'bold',
                marginLeft: '5px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
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
