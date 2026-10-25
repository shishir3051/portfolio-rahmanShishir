import React, { useState } from 'react';
import { Lock, KeyRound, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { API_BASE } from '../config';

// Labelled text input. `action` is an optional element shown on the right of the label row
// (used for the "Forgot password?" link).
const Field = ({ id, label, action, ...inputProps }) => (
  <div>
    <div className="mb-2 flex min-h-[24px] items-center justify-between gap-2">
      <label htmlFor={id} className="label mb-0">{label}</label>
      {action}
    </div>
    <input id={id} className="input" required {...inputProps} />
  </div>
);

// Plain-sentence status message under the form fields.
// Errors use role="alert" (announced immediately), success uses role="status" (announced politely).
// No tinted background on purpose: plain text on the card keeps AA contrast in both themes.
const STATUS_STYLES = {
  error: { role: 'alert', className: 'text-danger' },
  success: { role: 'status', className: 'text-accent2' },
};

const StatusMessage = ({ type, children }) => {
  const style = STATUS_STYLES[type];
  return (
    <p role={style.role} className={`text-sm leading-relaxed ${style.className}`}>
      {children}
    </p>
  );
};

// Shared look for the small inline text buttons ("Forgot password?", "Back to sign in").
// py-0.5 on a 20px line keeps the click target at least 24px tall.
const TEXT_BUTTON_CLASS = 'inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 text-[13px] font-medium leading-5 transition-colors';

// Pill with a pulsing green "live" dot, shown next to the lock icon
const SecureBadge = () => (
  <span className="chip gap-2 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-muted2">
    <span className="animate-pulse-ring h-1.5 w-1.5 rounded-full bg-accent2" aria-hidden="true" />
    Secure
  </span>
);

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('isAdmin', 'true');
        onLoginSuccess(data.user);
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recoveryKey, newPassword }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setMessage('Password reset successful. You can now login.');
        setShowRecovery(false);
        setRecoveryKey('');
        setNewPassword('');
      } else {
        setError(data.error || 'Reset failed');
      }
    } catch (err) {
      console.error('Password reset request failed:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  // Lock for signing in, key for the recovery flow
  const ModeIcon = showRecovery ? KeyRound : Lock;

  return (
    // Login is shown without a footer, so the screen itself centres the card below the floating navbar
    <div className="flex min-h-screen items-center justify-center px-4 pb-16 pt-28">
      <div className="animate-fade-in-up relative isolate w-full max-w-sm">
        {/* Soft aurora glow behind the card (decorative) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-12 -top-16 bottom-0 -z-10 rounded-full blur-[50px]"
          style={{ background: 'radial-gradient(closest-side, var(--glow), transparent)', opacity: 'var(--orb-opacity)' }}
        />

        <section aria-labelledby="login-title" className="gradient-border">
          <div className="gradient-border-inner relative overflow-hidden px-6 pb-6 pt-7 sm:px-8 sm:pb-7 sm:pt-8">
            {/* Thin accent highlight along the top edge */}
            <div
              aria-hidden="true"
              className="absolute inset-x-[18%] top-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)' }}
            />

            <header className="mb-7">
              <div className="flex items-center justify-between gap-3">
                <span className="icon-box h-11 w-11">
                  <ModeIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <SecureBadge />
              </div>
              <h1 id="login-title" className="mt-6 font-heading text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-text">
                {showRecovery ? 'Reset password' : 'Admin sign in'}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                {showRecovery
                  ? 'Enter the recovery key and choose a new password.'
                  : 'Sign in to manage your portfolio content.'}
              </p>
            </header>

            {!showRecovery ? (
              <form onSubmit={handleSubmit} aria-labelledby="login-title" className="space-y-5">
                {message && <StatusMessage type="success">{message}</StatusMessage>}

                <Field
                  id="login-username"
                  label="Username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <Field
                  id="login-password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  action={
                    <button
                      type="button"
                      onClick={() => setShowRecovery(true)}
                      className={`${TEXT_BUTTON_CLASS} -mr-1 text-accent hover:text-text`}
                    >
                      Forgot password?
                    </button>
                  }
                />

                {error && <StatusMessage type="error">{error}</StatusMessage>}

                <button type="submit" disabled={loading} className="btn-primary h-12 w-full text-[15px]">
                  {loading ? 'Signing in…' : 'Sign in'}
                  {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset} aria-labelledby="login-title" className="space-y-5">
                <Field
                  id="reset-recovery-key"
                  label="Recovery key"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={recoveryKey}
                  onChange={(e) => setRecoveryKey(e.target.value)}
                />

                <Field
                  id="reset-new-password"
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                {error && <StatusMessage type="error">{error}</StatusMessage>}

                <button type="submit" disabled={loading} className="btn-primary h-12 w-full text-[15px]">
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowRecovery(false)}
                    className={`${TEXT_BUTTON_CLASS} text-muted hover:text-text`}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to sign in
                  </button>
                </div>
              </form>
            )}

            {/* Short note at the foot of the card */}
            <p className="mt-7 flex items-start gap-2.5 border-t border-stroke pt-5 text-xs leading-relaxed text-muted2">
              <ShieldCheck className="mt-px h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {showRecovery
                  ? 'The recovery key is configured on the server by the site administrator.'
                  : 'This area is restricted to the site owner.'}
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
