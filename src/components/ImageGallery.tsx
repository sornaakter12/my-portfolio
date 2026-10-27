import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  Image as ImageIcon, 
  X, 
  Check, 
  Sparkles,
  Filter,
  RotateCcw
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'ai-image' | 'logo-design' | 'website-making' | 'other';
  categoryLabel: string;
  image: string; // URL or base64 data URL
  description?: string;
  date: string;
  isCustom?: boolean;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Crystal Botanical Sanctuary',
    category: 'ai-image',
    categoryLabel: 'AI Image Create',
    image: '/src/assets/images/project_ai_artwork_1793073549524.jpg',
    description: 'Fantasy concept artwork generated with generative AI, featuring bioluminescent lavender flowers, glowing crystals, and cinematic ambient lighting.',
    date: '2026',
  },
  {
    id: 'gal-2',
    title: 'Aethel Luxury Monogram Logo',
    category: 'logo-design',
    categoryLabel: 'Logo Design',
    image: '/src/assets/images/sample_logo_design_1793075212924.jpg',
    description: 'Embossed luxury monogram emblem in royal purple and gold foil, designed for upscale branding.',
    date: '2026',
  },
  {
    id: 'gal-3',
    title: 'Aura Responsive Web UI',
    category: 'website-making',
    categoryLabel: 'Website Making',
    image: '/src/assets/images/sample_website_making_1793075212980.jpg',
    description: 'Clean modern website interface with responsive layouts, purple accents, and fluid desktop-to-mobile structure.',
    date: '2026',
  },
  {
    id: 'gal-4',
    title: 'Social Media Carousel Series',
    category: 'ai-image',
    categoryLabel: 'AI & Graphics',
    image: '/src/assets/images/project_social_media_1793073550444.jpg',
    description: 'Aesthetic multi-slide social carousel design with pastel purple color harmony and modern typography.',
    date: '2026',
  },
  {
    id: 'gal-5',
    title: 'Design Festival & AI Workshop Poster',
    category: 'other',
    categoryLabel: 'Poster Design',
    image: '/src/assets/images/project_poster_design_1793073550254.jpg',
    description: 'Swiss-inspired promotional event poster balancing bold geometric layout and duotone typography.',
    date: '2026',
  },
];

const LOCAL_STORAGE_GALLERY_KEY = 'jannat_portfolio_gallery_v2';

export const ImageGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_GALLERY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load gallery items from storage', e);
    }
    return DEFAULT_GALLERY;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // Form states for adding new work
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'ai-image' | 'logo-design' | 'website-making' | 'other'>('ai-image');
  const [newDescription, setNewDescription] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage whenever items change
  const saveItems = (updated: GalleryItem[]) => {
    setItems(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_GALLERY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Storage limit reached or failed to save', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    // Limit to ~5MB to avoid exceeding localStorage quota
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size is too large (max 5MB). Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreviewUrl) {
      setUploadError('Please choose an image file to upload.');
      return;
    }
    if (!newTitle.trim()) {
      setUploadError('Please enter a title for your work.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      'ai-image': 'AI Image Create',
      'logo-design': 'Logo Design',
      'website-making': 'Website Making',
      'other': 'Other Design',
    };

    const newItem: GalleryItem = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || 'Work Sample',
      image: imagePreviewUrl,
      description: newDescription.trim() || 'Uploaded portfolio work sample by Jannat Ara Sorna.',
      date: new Date().getFullYear().toString(),
      isCustom: true,
    };

    saveItems([newItem, ...items]);

    // Reset form
    setNewTitle('');
    setNewDescription('');
    setImagePreviewUrl(null);
    setIsUploadModalOpen(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this image from your gallery?')) {
      const updated = items.filter((item) => item.id !== id);
      saveItems(updated);
      if (previewItem?.id === id) setPreviewItem(null);
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset gallery back to default samples?')) {
      saveItems(DEFAULT_GALLERY);
    }
  };

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((i) => i.category === activeCategory);

  return (
    <section id="gallery" className="py-16 bg-[#FAF9FF] border-t border-purple-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header with Title and Upload Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
              <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
              <span>MY WORK GALLERY</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Work Showcase &amp; Image Gallery
            </h2>
            <p className="mt-2 text-slate-600 text-sm max-w-lg">
              A visual gallery of my creations. You can also upload and add new images of completed works anytime!
            </p>
          </div>

          {/* Action: Upload Image Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Work</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              title="Reset gallery to default samples"
              className="p-2.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded-xl border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === 'all'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-purple-900 border border-purple-100'
            }`}
          >
            All Works ({items.length})
          </button>
          <button
            onClick={() => setActiveCategory('ai-image')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === 'ai-image'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-purple-900 border border-purple-100'
            }`}
          >
            AI Images
          </button>
          <button
            onClick={() => setActiveCategory('logo-design')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === 'logo-design'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-purple-900 border border-purple-100'
            }`}
          >
            Logo Design
          </button>
          <button
            onClick={() => setActiveCategory('website-making')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === 'website-making'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-purple-900 border border-purple-100'
            }`}
          >
            Website Making
          </button>
          <button
            onClick={() => setActiveCategory('other')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === 'other'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-purple-900 border border-purple-100'
            }`}
          >
            Other Designs
          </button>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-purple-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No images in this category yet</h3>
            <p className="text-xs text-slate-500 mb-4">Click below to upload your work!</p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-purple-700 text-white text-xs font-bold rounded-xl"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setPreviewItem(item)}
                className="group bg-white rounded-2xl border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-purple-50 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-purple-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                    {item.categoryLabel}
                  </div>

                  {/* Delete Button for custom uploads */}
                  {item.isCustom && (
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      title="Remove from gallery"
                      className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center transition-colors shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-purple-950 rounded-xl text-xs font-bold shadow-lg">
                      <Eye className="w-4 h-4 text-purple-700" />
                      <span>View Full Image</span>
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-purple-950/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upload Your Work Image
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add images of works you have created to your portfolio gallery.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                {uploadError}
              </div>
            )}

            <form onSubmit={handleAddWork} className="space-y-4 text-xs">
              
              {/* Image Picker */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Image File *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-purple-200 rounded-xl file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-purple-800 hover:file:bg-purple-200 cursor-pointer"
                />
              </div>

              {/* Image Preview */}
              {imagePreviewUrl && (
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-purple-50 border border-purple-200">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Work Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Minimalist Logo Design"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-600 outline-hidden font-medium text-slate-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-600 outline-hidden font-medium text-slate-900 bg-white"
                >
                  <option value="ai-image">AI Image Create</option>
                  <option value="logo-design">Logo Design</option>
                  <option value="website-making">Website Making</option>
                  <option value="other">Other Design Work</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief details about what you created..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-600 outline-hidden text-slate-900 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-purple-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Add to Gallery</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-purple-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-purple-100 p-6 animate-in zoom-in-95 duration-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200">
                {previewItem.categoryLabel}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-600 hover:text-purple-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
              <img
                src={previewItem.image}
                alt={previewItem.title}
                referrerPolicy="no-referrer"
                className="w-full max-h-[500px] object-contain"
              />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {previewItem.title}
            </h3>
            {previewItem.description && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {previewItem.description}
              </p>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
