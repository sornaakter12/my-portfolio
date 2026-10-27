import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, LogOut, Check, AlertCircle, RefreshCw, Camera } from 'lucide-react';

interface OwnerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  ownerEmail: string;
  onLoginSuccess: (token: string, email: string) => void;
  onLogout: () => void;
  onOpenChangeImage: () => void;
  token: string | null;
}

export const OwnerAuthModal: React.FC<OwnerAuthModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  ownerEmail,
  onLoginSuccess,
  onLogout,
  onOpenChangeImage,
  token,
}) => {
  const [emailInput, setEmailInput] = useState('j41975994@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Change password states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      onLoginSuccess(data.token, data.ownerEmail);
      setSuccessMessage('Successfully signed in as website owner!');
      setPasswordInput('');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      console.error('Owner login error:', err);
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setSuccessMessage('Password changed successfully on the server!');
      setCurrentPassword('');
      setNewPassword('');
      setShowPasswordChange(false);
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Password update failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-purple-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-purple-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Owner Authentication Area
              </h3>
              <p className="text-xs text-slate-500">
                Secure server-side access for Jannat Ara Sorna
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Authenticated View */}
        {isAuthenticated ? (
          <div className="space-y-5">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-950 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>You are Authenticated as Owner</span>
              </div>
              <div className="text-xs text-slate-600 font-mono truncate">
                {ownerEmail}
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChangeImage();
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Change Profile Image Now</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-semibold rounded-xl border border-purple-200 flex items-center justify-center gap-2 transition-colors"
              >
                <KeyRound className="w-4 h-4 text-purple-600" />
                <span>{showPasswordChange ? 'Hide Password Form' : 'Change Owner Password'}</span>
              </button>
            </div>

            {/* Change Password Form Sub-panel */}
            {showPasswordChange && (
              <form onSubmit={handleChangePassword} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {isLoading ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            )}

            <div className="pt-4 border-t border-purple-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                End Owner Session
              </span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Owner Email Address
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-slate-900 focus:ring-2 focus:ring-purple-600 outline-hidden font-medium"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  Owner Password
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordInput('Jannat@2026!')}
                  className="text-[11px] text-purple-700 hover:text-purple-950 font-bold underline cursor-pointer"
                >
                  Use Default: Jannat@2026!
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter password (e.g. Jannat@2026!)"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-slate-900 focus:ring-2 focus:ring-purple-600 outline-hidden"
              />
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-slate-600 leading-relaxed">
              <span className="font-bold text-purple-900">Security Note: </span>
              Passwords and session tokens are strictly validated on the server. Regular website visitors do not have access to this portal.
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Server...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Owner Area</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
