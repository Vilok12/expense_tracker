import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import {
  User,
  Mail,
  Lock,
  Trash2,
  ShieldAlert,
  UserCheck,
  KeyRound,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password reset state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Cascade account delete modal trigger
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email) return;
    setUpdatingProfile(true);
    await updateProfile(profileData.name, profileData.email);
    setUpdatingProfile(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setUpdatingPassword(true);
    const success = await changePassword(currentPassword, newPassword);
    setUpdatingPassword(false);
    
    if (success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  const handleConfirmDelete = async () => {
    await deleteAccount();
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage profile details, change security credentials, and delete your wealth flow account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Update Profile Settings */}
        <div className="glass-panel rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
              <UserCheck className="h-4.5 w-4.5 text-indigo-500" />
              Update Profile Details
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
              Change your display name and registered email address
            </p>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              
              {/* Display name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="John Doe"
                    className="glass-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="john@example.com"
                    className="glass-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="gradient-btn font-semibold text-xs h-10 w-full"
                disabled={updatingProfile}
              >
                {updatingProfile ? 'Saving Details...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>

        {/* Change Account Password */}
        <div className="glass-panel rounded-2xl p-6 shadow-sm">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-1">
            <KeyRound className="h-4.5 w-4.5 text-indigo-500" />
            Secure Password Change
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
            Modify credentials to protect your financial workspace
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="glass-input pl-10"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Min. 6 characters"
                  className="glass-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="glass-input pl-10"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="gradient-btn font-semibold text-xs h-10 w-full"
              disabled={updatingPassword}
            >
              {updatingPassword ? 'Updating Password...' : 'Change Secure Password'}
            </button>
          </form>
        </div>

      </div>

      {/* Danger Zone: Cascade account deletion */}
      <div className="rounded-2xl border border-red-200 bg-red-500/5 p-6 dark:border-red-500/10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-600 dark:text-red-400">
                Danger Zone: Terminate WealthFlow Account
              </h4>
              <p className="text-xs text-red-500/75 dark:text-red-400/60 mt-1 max-w-xl leading-relaxed">
                Deleting your account is permanent. All transactions ledger records, budgets, monthly limits, and personal configurations will be cascades deleted from MongoDB database. There is no backup.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/25 px-5 py-2.5 text-xs font-bold text-white transition active:scale-95 shrink-0"
          >
            <Trash2 className="h-4.5 w-4.5" />
            Delete Account Permanently
          </button>
        </div>
      </div>

      {/* OVERLAY MODAL */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Permanently Terminate Profile"
        message="This is it. Confirming will permanently delete your user profile, configurations, budget caps, and entire transaction ledger from database files. Proceed?"
      />
    </div>
  );
};

export default Profile;
export { Profile };
