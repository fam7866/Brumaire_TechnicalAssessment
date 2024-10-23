import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from '../../utils/authService';
import toast, { Toaster } from 'react-hot-toast';
import logo from 'assets/svgs/logo_small_blue.svg'; // Import the SVG file as a module

import './AuthPage.css';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    if (isSignUp) {
      const user = await signUpWithEmail(email, password);
      if (user) {
        toast.success('Signed up successfully!');
        window.location.href = '/'; // Redirect to wallet connection process
      } else {
        toast.error('Failed to sign up. Please check your details.');
      }
    } else {
      const user = await signInWithEmail(email, password);
      if (user) {
        toast.success('Signed in successfully!');
        window.location.href = '/'; // Redirect to wallet connection process
      } else {
        toast.error('Failed to sign in. Please check your email and password.');
      }
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <h2 className="auth-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
        <input
          type="email"
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="auth-button" onClick={handleAuth}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <p className="auth-toggle" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
