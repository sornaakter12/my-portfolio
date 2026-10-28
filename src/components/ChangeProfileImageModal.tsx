import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertCircle, RefreshCw, Image as ImageIcon, Camera, ArrowRight, ShieldCheck } from 'lucide-react';

interface ChangeProfileImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  onImageUpdated: (newUrl: string) => void;
  token: string | null;
}

export const ChangeProfileImageModal: React.FC<ChangeProfileImageModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  onImageUpdated,
  token,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) return;

    // Validate mime type: JPG, PNG, WEBP
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Invalid file format. Please upload a JPG, PNG, or WEBP image.');
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    // Validate size: 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5MB.`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Generate local preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file. Please try another.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAndSave = async () => {
    if (!selectedFile || !previewUrl) {
      setErrorMessage('Please select an image file first.');
      return;
    }

    if (!token) {
      setErrorMessage('Owner session not found. Please log in as owner first.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/owner/profile-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType: selectedFile.type,
          fileName: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server rejected the upload.');
      }

      setSuccessMessage(data.message || 'Profile image updated successfully!');
      onImageUpdated(data.profileImageUrl);

      setTimeout(() => {
        onClose();
        setSelectedFile(null);
        setPreviewUrl(null);
        setSuccessMessage(null);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to upload image:', err);
      setErrorMessage(err.message || 'An error occurred while uploading. Please check your network and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!token) return;
    if (!window.confirm('Reset the profile image back to the original default portrait?')) return;

    setIsUploading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/owner/reset-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset.');
      setSuccessMessage('Profile image reset to default portrait!');
      onImageUpdated(data.profileImageUrl);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || 'Reset failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-purple-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-purple-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Change Home Profile Image
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  Owner Area
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Upload a JPG, PNG, or WEBP image to replace your right-side hero portrait.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Comparison / Live Preview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          
          {/* Current Active Image in Arched Frame */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Current Live Image
            </span>
            <div className="w-full max-w-[210px] aspect-[3/4] rounded-t-[100px] rounded-b-2xl border-2 border-purple-200 overflow-hidden bg-purple-50 shadow-sm relative">
              <img
                src={
                  currentImageUrl && currentImageUrl.startsWith('/src/assets/images/')
                    ? currentImageUrl.replace('/src/assets/images/', '/assets/images/')
                    : currentImageUrl
                }
                alt="Current Profile"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('/src/assets/images/')) {
                    target.src = target.src.replace('/src/assets/images/', '/assets/images/');
                  }
                }}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-2 inset-x-2 bg-black/60 backdrop-blur-xs text-white text-[10px] text-center py-1 rounded-md">
                Active on Website
              </div>
            </div>
          </div>

          {/* New Image Preview in Arched Frame */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
              New Image Preview
            </span>
            <div className="w-full max-w-[210px] aspect-[3/4] rounded-t-[100px] rounded-b-2xl border-2 border-dashed border-purple-400 overflow-hidden bg-purple-50/70 shadow-sm relative flex items-center justify-center">
              {previewUrl ? (
                <>
                  <img
                    src={previewUrl}
                    alt="New Preview"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-2 inset-x-2 bg-purple-700/80 backdrop-blur-xs text-white text-[10px] text-center py-1 rounded-md font-semibold">
                    Preview (Not Saved Yet)
                  </div>
                </>
              ) : (
                <div className="text-center p-4 space-y-2">
                  <ImageIcon className="w-8 h-8 text-purple-300 mx-auto" />
                  <p className="text-[11px] text-purple-700 font-medium leading-snug">
                    Select an image below to see how it fits inside the arched frame
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* File Upload Selector */}
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 sm:p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-purple-950">
              Select Image from Computer or Phone
            </label>
            <span className="text-[11px] text-slate-500">
              JPG, PNG, WEBP (Max 5MB)
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="w-full px-3 py-2 border border-purple-200 rounded-xl bg-white file:mr-3 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer text-xs text-slate-700"
          />

          {selectedFile && (
            <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-purple-100">
              <span className="font-medium truncate max-w-xs">{selectedFile.name}</span>
              <span className="font-mono text-[11px] text-purple-700 font-semibold">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-purple-100">
          <button
            type="button"
            onClick={handleResetToDefault}
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Default Portrait</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUploadAndSave}
              disabled={isUploading || !selectedFile}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all ${
                !selectedFile || isUploading
                  ? 'bg-purple-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 hover:shadow-lg'
              }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving to Server...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Save &amp; Update Live Image</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
