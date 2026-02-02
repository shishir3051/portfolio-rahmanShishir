import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { API_BASE } from '../config';

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
            setError('Failed to connect to the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass max-w-md w-full p-8 md:p-10 border border-white/10 shadow-2xl overflow-hidden relative"
            >
                {/* Decorative Background Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent2/20 rounded-full blur-3xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent2 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/30">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
                        {showRecovery ? 'EMERGENCY' : 'RESTRICTED'} <span className="text-accent">{showRecovery ? 'RECOVERY' : 'AREA'}</span>
                    </h1>
                    <p className="text-muted text-sm font-medium tracking-wide">SHISHIR PORTFOLIO OS v1.0 {showRecovery ? 'RECOVERY PROTOCOL' : 'AUTHENTICATION'}</p>
                </div>

                {!showRecovery ? (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted2 ml-1">Identity UID</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:bg-[#1a1a1a] transition-all text-sm font-bold text-white placeholder:text-muted2"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted2">Access Cipher</label>
                                <button
                                    type="button"
                                    onClick={() => setShowRecovery(true)}
                                    className="text-[9px] text-accent/50 font-bold uppercase tracking-widest hover:text-accent transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:bg-[#1a1a1a] transition-all text-sm font-bold text-white placeholder:text-muted2"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {message && (
                            <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent text-xs font-bold">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative overflow-hidden bg-gradient-to-r from-accent to-accent2 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Initialize Dashboard</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleReset} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted2 ml-1">Recovery Key</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={recoveryKey}
                                    onChange={(e) => setRecoveryKey(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:bg-[#1a1a1a] transition-all text-sm font-bold text-white placeholder:text-muted2"
                                    placeholder="Enter System Recovery Key"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted2 ml-1">New Access Cipher</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted group-focus-within:text-accent transition-colors">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-[#111111] border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-accent/50 focus:bg-[#1a1a1a] transition-all text-sm font-bold text-white placeholder:text-muted2"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setShowRecovery(false)}
                                className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl text-muted font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-[2] bg-accent py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Reset Access'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 text-center relative z-10">
                    <p className="text-[9px] text-muted2 font-bold uppercase tracking-[0.2em] leading-relaxed">
                        {showRecovery
                            ? "Emergency access requires the server administrator key."
                            : "Unauthorized access attempts are logged."}
                        <br />
                        IP: {"CALCULATING..."} • PORT: 443
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
