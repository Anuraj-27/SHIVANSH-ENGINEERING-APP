import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  LogOut,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  Layers,
  Cog,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { useRouter } from '../router/Router';
import {
  getStoredGallery,
  saveGallery,
  getStoredProcessingLinesMedia,
  saveProcessingLineMedia,
  getStoredEquipmentsMedia,
  saveEquipmentMedia,
  removeEquipmentMedia,
  getStoredLandingImages,
  saveLandingImages,
  processAndCompressImage,
  GalleryPhoto,
  LandingShowcaseImage,
  DEFAULT_GALLERY,
  DEFAULT_LANDING_IMAGES
} from '../services/mediaStore';
import { PROCESSING_LINES } from '../data/processingLinesData';
import { EQUIPMENTS_LIST } from './EquipmentsPage';

const AUTH_KEY = 'shivansh_admin_auth_token';

export const AdminPage: React.FC = () => {
  const { navigate } = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'landing-showcase' | 'gallery' | 'processing-lines' | 'equipments'>('landing-showcase');

  // Media States
  const [landingImages, setLandingImages] = useState<LandingShowcaseImage[]>(getStoredLandingImages());
  const [gallery, setGallery] = useState<GalleryPhoto[]>(getStoredGallery());
  const [processingLinesMedia, setProcessingLinesMedia] = useState(getStoredProcessingLinesMedia());
  const [equipmentsMedia, setEquipmentsMedia] = useState(getStoredEquipmentsMedia());

  // Upload Feedback
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Landing Showcase Upload State
  const [newShowcaseTitle, setNewShowcaseTitle] = useState('');
  const [newShowcaseUrl, setNewShowcaseUrl] = useState('');
  const [newShowcasePreview, setNewShowcasePreview] = useState<string | null>(null);
  const [showcaseInputMode, setShowcaseInputMode] = useState<'upload' | 'url'>('upload');
  const showcaseFileInputRef = useRef<HTMLInputElement>(null);

  // Gallery Upload Form State
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<'processing-line' | 'equipment' | 'installation'>('processing-line');
  const [newGalleryLocation, setNewGalleryLocation] = useState('Pune Works Unit II');
  const [newGallerySpeed, setNewGallerySpeed] = useState('Custom Specification');
  const [newGalleryPreview, setNewGalleryPreview] = useState<string | null>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Processing Line Photo Form State
  const [selectedLineSlug, setSelectedLineSlug] = useState(PROCESSING_LINES[0].slug);
  const [lineImagePreview, setLineImagePreview] = useState<string | null>(null);
  const lineFileInputRef = useRef<HTMLInputElement>(null);

  // Equipment Photo Form State
  const [selectedEquipment, setSelectedEquipment] = useState(EQUIPMENTS_LIST[0]);
  const [equipmentImagePreview, setEquipmentImagePreview] = useState<string | null>(null);
  const equipmentFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state on updates
  useEffect(() => {
    const handleSync = () => {
      setLandingImages(getStoredLandingImages());
      setGallery(getStoredGallery());
      setProcessingLinesMedia(getStoredProcessingLinesMedia());
      setEquipmentsMedia(getStoredEquipmentsMedia());
    };
    window.addEventListener('shivansh-media-updated', handleSync);
    return () => window.removeEventListener('shivansh-media-updated', handleSync);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === 'shivansh' && password === 'SMK@12345') {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Please enter username: shivansh and assigned password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    setUsername('');
    setPassword('');
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // --- Handlers: Landing Showcase ---
  const handleShowcaseFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressed = await processAndCompressImage(file);
      setNewShowcasePreview(compressed);
    } catch (err) {
      console.error(err);
      alert('Error processing image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddShowcaseImage = (e: React.FormEvent) => {
    e.preventDefault();
    const finalImageUrl = showcaseInputMode === 'url' ? newShowcaseUrl.trim() : newShowcasePreview;

    if (!finalImageUrl) {
      alert('Please select an image file or provide an image URL');
      return;
    }
    if (!newShowcaseTitle.trim()) {
      alert('Please enter a Heading Title for the showcase slide');
      return;
    }

    const newItem: LandingShowcaseImage = {
      id: `landing-${Date.now()}`,
      title: newShowcaseTitle.trim().toUpperCase(),
      imageUrl: finalImageUrl,
    };

    const updated = [newItem, ...landingImages];
    setLandingImages(updated);
    saveLandingImages(updated);

    // Reset Form
    setNewShowcaseTitle('');
    setNewShowcaseUrl('');
    setNewShowcasePreview(null);
    if (showcaseFileInputRef.current) showcaseFileInputRef.current.value = '';
    showNotification(`Added "${newItem.title}" to Landing Page Showcase!`);
  };

  const handleDeleteShowcaseImage = (id: string) => {
    if (landingImages.length <= 1) {
      alert('At least one showcase image must remain for the landing page hero.');
      return;
    }
    if (window.confirm('Remove this slide from the landing page showcase?')) {
      const updated = landingImages.filter((item) => item.id !== id);
      setLandingImages(updated);
      saveLandingImages(updated);
      showNotification('Slide removed from Landing Page Showcase.');
    }
  };

  const handleMoveShowcaseImage = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= landingImages.length) return;

    const updated = [...landingImages];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIdx, 0, moved);

    setLandingImages(updated);
    saveLandingImages(updated);
    showNotification('Showcase slide order updated.');
  };

  const handleResetShowcaseToDefaults = () => {
    if (window.confirm('Reset Landing Showcase to factory default images?')) {
      setLandingImages(DEFAULT_LANDING_IMAGES);
      saveLandingImages(DEFAULT_LANDING_IMAGES);
      showNotification('Landing Showcase reset to factory defaults.');
    }
  };

  // --- Handlers: Gallery Upload ---
  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressed = await processAndCompressImage(file);
      setNewGalleryPreview(compressed);
    } catch (err) {
      console.error(err);
      alert('Error processing image. Please try another file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryPreview || !newGalleryTitle) {
      alert('Please select an image and enter a title');
      return;
    }

    const newItem: GalleryPhoto = {
      id: `gal-${Date.now()}`,
      title: newGalleryTitle,
      category: newGalleryCategory,
      location: newGalleryLocation || 'Pune Works Unit II',
      speed: newGallerySpeed || 'Standard OEM Rating',
      imageUrl: newGalleryPreview,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    const updated = [newItem, ...gallery];
    setGallery(updated);
    saveGallery(updated);

    // Reset Form
    setNewGalleryTitle('');
    setNewGalleryPreview(null);
    if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
    showNotification(`Added "${newItem.title}" to Gallery!`);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this image from the gallery?')) {
      const updated = gallery.filter((item) => item.id !== id);
      setGallery(updated);
      saveGallery(updated);
      showNotification('Photo removed from Gallery.');
    }
  };

  const handleResetGalleryToDefault = () => {
    if (window.confirm('Reset gallery to initial factory photos?')) {
      setGallery(DEFAULT_GALLERY);
      saveGallery(DEFAULT_GALLERY);
      showNotification('Gallery reset to default factory photos.');
    }
  };

  // --- Handlers: Processing Line Photo Upload ---
  const handleLineFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressed = await processAndCompressImage(file);
      setLineImagePreview(compressed);
    } catch (err) {
      console.error(err);
      alert('Error processing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveProcessingLinePhoto = () => {
    if (!lineImagePreview) return;
    saveProcessingLineMedia(selectedLineSlug, lineImagePreview);
    setProcessingLinesMedia(getStoredProcessingLinesMedia());
    setLineImagePreview(null);
    if (lineFileInputRef.current) lineFileInputRef.current.value = '';
    const lineObj = PROCESSING_LINES.find((l) => l.slug === selectedLineSlug);
    showNotification(`Updated live photo for ${lineObj?.name || 'Processing Line'}!`);
  };

  const handleResetLinePhoto = (slug: string) => {
    const current = { ...processingLinesMedia };
    delete current[slug];
    localStorage.setItem('shivansh_processing_lines_media', JSON.stringify(current));
    setProcessingLinesMedia(current);
    window.dispatchEvent(new Event('shivansh-media-updated'));
    showNotification('Restored default factory machine photo.');
  };

  // --- Handlers: Equipment Photo Upload ---
  const handleEquipmentFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessing(true);
      const compressed = await processAndCompressImage(file);
      setEquipmentImagePreview(compressed);
    } catch (err) {
      console.error(err);
      alert('Error processing image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveEquipmentPhoto = () => {
    if (!equipmentImagePreview) return;
    saveEquipmentMedia(selectedEquipment, equipmentImagePreview);
    setEquipmentsMedia(getStoredEquipmentsMedia());
    setEquipmentImagePreview(null);
    if (equipmentFileInputRef.current) equipmentFileInputRef.current.value = '';
    showNotification(`Assigned photo to equipment "${selectedEquipment}"!`);
  };

  const handleRemoveEquipmentPhoto = (name: string) => {
    removeEquipmentMedia(name);
    setEquipmentsMedia(getStoredEquipmentsMedia());
    showNotification(`Removed photo from "${name}".`);
  };

  // If not logged in, render Secure Login Box
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] bg-canvas flex items-center justify-center py-16 px-4 font-sans relative">
        <div className="blueprint-watermark" />

        <div className="max-w-md w-full bg-ivory rounded-2xl border border-border shadow-card-elevated p-8 sm:p-10 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-canvas border border-border text-sage flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display font-normal text-3xl text-ink tracking-normal">
              Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-ink mt-2">
              Shivansh Engineering · Media Upload &amp; Control
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-terracotta/10 border border-terracotta text-xs text-ink font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-terracotta" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="shivansh"
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border-strong bg-ivory text-sm focus:outline-none focus:ring-2 focus:ring-ink/25 focus:border-ink text-ink"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 text-sm font-semibold text-ivory bg-ink hover:bg-ink-hover rounded-xl transition-colors duration-150 shadow-soft-diffused mt-2"
            >
              Sign In to Console
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center text-xs text-ink font-sans font-medium uppercase tracking-[0.08em]">
            Authorized Personnel Only · Shivansh OEM
          </div>
        </div>
      </div>
    );
  }

  // Current selected processing line item
  const selectedLineObj = PROCESSING_LINES.find((l) => l.slug === selectedLineSlug) || PROCESSING_LINES[0];
  const activeCustomLinePhoto = processingLinesMedia[selectedLineSlug]?.mainImage;

  return (
    <div className="bg-canvas min-h-[85vh] py-10 border-b border-border font-sans relative">
      <div className="blueprint-watermark" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header & Admin Status Bar */}
        <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sage" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink">
                ACTIVE ADMIN SESSION · SHIVANSH
              </span>
            </div>
            <h1 className="font-display font-normal text-3xl sm:text-4xl text-ink tracking-normal">
              Website Media Upload Console
            </h1>
            <p className="text-sm text-ink mt-1">
              Manage dynamic media across Landing Page Elevated Showcase, Gallery, Processing Lines, and Equipments.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl border border-ink bg-ivory hover:bg-canvas text-xs font-semibold text-ink transition-colors duration-150 flex items-center gap-2"
            >
              <span>View Landing Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-terracotta/15 border border-terracotta hover:bg-terracotta/25 text-xs font-semibold text-ink transition-colors duration-150 flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Global Success Notification */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-ivory border border-sage text-ink text-sm font-medium flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-sage shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-4 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('landing-showcase')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center gap-2 shrink-0 ${
              activeTab === 'landing-showcase'
                ? 'bg-ink text-ivory'
                : 'bg-ivory text-ink hover:bg-canvas border border-border'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'landing-showcase' ? 'text-ivory' : 'text-sage'}`} />
            <span>Landing Showcase Box ({landingImages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center gap-2 shrink-0 ${
              activeTab === 'gallery'
                ? 'bg-ink text-ivory'
                : 'bg-ivory text-ink hover:bg-canvas border border-border'
            }`}
          >
            <ImageIcon className={`w-4 h-4 ${activeTab === 'gallery' ? 'text-ivory' : 'text-sage'}`} />
            <span>Gallery Photos ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('processing-lines')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center gap-2 shrink-0 ${
              activeTab === 'processing-lines'
                ? 'bg-ink text-ivory'
                : 'bg-ivory text-ink hover:bg-canvas border border-border'
            }`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'processing-lines' ? 'text-ivory' : 'text-sage'}`} />
            <span>Processing Lines (12 Lines)</span>
          </button>

          <button
            onClick={() => setActiveTab('equipments')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 flex items-center gap-2 shrink-0 ${
              activeTab === 'equipments'
                ? 'bg-ink text-ivory'
                : 'bg-ivory text-ink hover:bg-canvas border border-border'
            }`}
          >
            <Cog className={`w-4 h-4 ${activeTab === 'equipments' ? 'text-ivory' : 'text-sage'}`} />
            <span>Equipments Units (29 Units)</span>
          </button>
        </div>

        {/* TAB 0: LANDING PAGE ELEVATED SHOWCASE BOX MANAGEMENT */}
        {activeTab === 'landing-showcase' && (
          <div className="space-y-8">
            <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6">
                <div>
                  <h2 className="font-display font-normal text-2xl text-ink">
                    Add Slide to Landing Page Elevated Showcase Box
                  </h2>
                  <p className="text-xs text-ink/80 mt-0.5">
                    Images added here dynamically cycle in the animated bottom-right floating box on the homepage.
                  </p>
                </div>
                <button
                  onClick={handleResetShowcaseToDefaults}
                  className="text-xs font-semibold text-ink hover:bg-canvas border border-border flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors duration-150"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sage" />
                  <span>Reset to Factory Defaults</span>
                </button>
              </div>

              <form onSubmit={handleAddShowcaseImage} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Input Selection & Preview */}
                <div className="lg:col-span-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-ink uppercase tracking-[0.1em]">
                      Showcase Image *
                    </label>
                    <div className="inline-flex p-0.5 bg-canvas border border-border rounded-lg text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setShowcaseInputMode('upload')}
                        className={`px-2.5 py-1 rounded-md transition-colors duration-150 ${
                          showcaseInputMode === 'upload' ? 'bg-ink text-ivory' : 'text-ink'
                        }`}
                      >
                        File Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowcaseInputMode('url')}
                        className={`px-2.5 py-1 rounded-md transition-colors duration-150 ${
                          showcaseInputMode === 'url' ? 'bg-ink text-ivory' : 'text-ink'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {showcaseInputMode === 'upload' ? (
                    <div>
                      <div
                        onClick={() => showcaseFileInputRef.current?.click()}
                        className="border-2 border-dashed border-border-strong hover:border-sage bg-canvas/60 hover:bg-canvas rounded-2xl p-6 text-center cursor-pointer transition-colors duration-150 aspect-[16/10] flex flex-col items-center justify-center relative overflow-hidden group"
                      >
                        {newShowcasePreview ? (
                          <img
                            src={newShowcasePreview}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-xl bg-ivory border border-border text-sage flex items-center justify-center mb-3">
                              <Upload className="w-6 h-6 text-sage" />
                            </div>
                            <div className="text-sm font-semibold text-ink">
                              Upload Machinery Photo
                            </div>
                            <div className="text-xs text-ink/75 mt-1">
                              PNG, JPG, WebP (Optimized)
                            </div>
                          </>
                        )}
                        <input
                          ref={showcaseFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleShowcaseFileSelect}
                          className="hidden"
                        />
                      </div>

                      {newShowcasePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setNewShowcasePreview(null);
                            if (showcaseFileInputRef.current) showcaseFileInputRef.current.value = '';
                          }}
                          className="text-xs font-semibold text-ink underline decoration-terracotta mt-2 block"
                        >
                          Clear Uploaded Photo
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="relative mb-3">
                        <input
                          type="url"
                          placeholder="https://example.com/machine-image.jpg"
                          value={newShowcaseUrl}
                          onChange={(e) => setNewShowcaseUrl(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-border-strong bg-ivory text-ink text-sm focus:ring-2 focus:ring-ink/25 focus:border-ink focus:outline-none"
                        />
                      </div>
                      <div className="aspect-[16/10] rounded-2xl border border-border bg-canvas flex items-center justify-center overflow-hidden">
                        {newShowcaseUrl.trim() ? (
                          <img
                            src={newShowcaseUrl}
                            alt="URL Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-xs text-ink/70">Enter Image URL Above</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Heading Title Only & Submit */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-1.5">
                        Slide Heading Title Only * (No Paragraphs)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CONTINUOUS HIGH-SPEED SLITTING LINE"
                        value={newShowcaseTitle}
                        onChange={(e) => setNewShowcaseTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border-strong bg-ivory text-ink text-sm focus:ring-2 focus:ring-ink/25 focus:border-ink focus:outline-none uppercase font-semibold"
                      />
                      <span className="text-[11px] text-ink/75 mt-1 block">
                        Strict "Headings-Only" architecture: this title is displayed prominently in the bottom corner of the slide.
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-canvas border border-border text-xs text-ink space-y-1">
                      <div className="font-semibold text-ink">Showcase Specifications:</div>
                      <div>• Slides rotate automatically every 3.5 seconds with smooth cross-fade animation.</div>
                      <div>• Pauses on mouse hover so visitors can inspect the machine details.</div>
                      <div>• Updates live immediately across all active browser sessions.</div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <button
                      type="submit"
                      disabled={isProcessing || (!newShowcasePreview && !newShowcaseUrl.trim()) || !newShowcaseTitle.trim()}
                      className="w-full py-3.5 px-6 rounded-xl bg-ink hover:bg-ink-hover disabled:opacity-50 text-ivory font-semibold text-sm shadow-soft-diffused transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-ivory" />
                      <span>{isProcessing ? 'Processing Image...' : 'Publish to Landing Showcase Box'}</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>

            {/* Current Showcase Slides */}
            <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-normal text-2xl text-ink">
                    Active Showcase Slides ({landingImages.length})
                  </h2>
                  <p className="text-xs text-ink/80 mt-0.5">
                    Reorder slides using the arrows or delete slides. First slide displays initially on page load.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {landingImages.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    className="rounded-2xl border border-border overflow-hidden bg-canvas/60 flex flex-col justify-between hover:border-sage transition-colors duration-150"
                  >
                    <div>
                      <div className="aspect-[16/10] bg-canvas overflow-hidden relative">
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-ink text-ivory text-[10px] font-sans font-semibold px-2 py-0.5 rounded-md uppercase tracking-[0.08em]">
                          SLIDE #{idx + 1}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-ink uppercase line-clamp-2">
                          {slide.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-3 bg-ivory border-t border-border flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveShowcaseImage(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Earlier"
                          className="p-1.5 rounded-lg border border-border hover:bg-canvas disabled:opacity-30 disabled:pointer-events-none text-ink transition-colors duration-150"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveShowcaseImage(idx, 'down')}
                          disabled={idx === landingImages.length - 1}
                          title="Move Later"
                          className="p-1.5 rounded-lg border border-border hover:bg-canvas disabled:opacity-30 disabled:pointer-events-none text-ink transition-colors duration-150"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteShowcaseImage(slide.id)}
                        className="text-xs text-ink font-semibold px-2 py-1.5 rounded-lg border border-terracotta/60 hover:bg-terracotta/15 transition-colors duration-150 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-terracotta" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: GALLERY PHOTOS MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6">
                <div>
                  <h2 className="font-display font-normal text-2xl text-ink">
                    Upload New Photo to Gallery
                  </h2>
                  <p className="text-xs text-ink/80 mt-0.5">
                    Images will immediately appear in the public Field Gallery page.
                  </p>
                </div>
                <button
                  onClick={handleResetGalleryToDefault}
                  className="text-xs font-semibold text-ink hover:bg-canvas border border-border flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors duration-150"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-sage" />
                  <span>Reset Gallery to Default</span>
                </button>
              </div>

              <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                  <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                    Photo File *
                  </label>

                  <div
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="border-2 border-dashed border-border-strong hover:border-sage bg-canvas/60 hover:bg-canvas rounded-2xl p-6 text-center cursor-pointer transition-colors duration-150 aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden"
                  >
                    {newGalleryPreview ? (
                      <img
                        src={newGalleryPreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-ivory border border-border text-sage flex items-center justify-center mb-3">
                          <Upload className="w-6 h-6 text-sage" />
                        </div>
                        <div className="text-sm font-semibold text-ink">
                          Click to Browse or Drag Photo
                        </div>
                        <div className="text-xs text-ink/75 mt-1">
                          PNG, JPG, WebP (Automatically optimized)
                        </div>
                      </>
                    )}
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleGalleryFileSelect}
                      className="hidden"
                    />
                  </div>

                  {newGalleryPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setNewGalleryPreview(null);
                        if (galleryFileInputRef.current) galleryFileInputRef.current.value = '';
                      }}
                      className="text-xs font-semibold text-ink underline decoration-terracotta mt-2 block"
                    >
                      Clear Selected Photo
                    </button>
                  )}
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-1.5">
                      Photo Title / Machine Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Continuous 2100mm Slitting Line Assembly"
                      value={newGalleryTitle}
                      onChange={(e) => setNewGalleryTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-strong bg-ivory text-ink text-sm focus:ring-2 focus:ring-ink/25 focus:border-ink focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-1.5">
                        Category
                      </label>
                      <select
                        value={newGalleryCategory}
                        onChange={(e) => setNewGalleryCategory(e.target.value as 'processing-line' | 'equipment' | 'installation')}
                        className="w-full px-4 py-2.5 rounded-xl border border-border-strong text-ink text-sm focus:ring-2 focus:ring-ink/25 focus:border-ink focus:outline-none bg-ivory"
                      >
                        <option value="processing-line">Processing Line</option>
                        <option value="equipment">Equipments</option>
                        <option value="installation">Installation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-1.5">
                        Location / Factory
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Sanaswadi Plant, Pune"
                        value={newGalleryLocation}
                        onChange={(e) => setNewGalleryLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border-strong bg-ivory text-ink text-sm focus:ring-2 focus:ring-ink/25 focus:border-ink focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink uppercase tracking-[0.1em] mb-1.5">
                      Speed / Technical Specification
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 300 m/min · 0.2mm to 8.0mm"
                      value={newGallerySpeed}
                      onChange={(e) => setNewGallerySpeed(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border-strong bg-ivory text-ink text-sm focus:ring-2 focus:ring-ink/25 focus:border-ink focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing || !newGalleryPreview}
                      className="w-full py-3.5 px-6 rounded-xl bg-ink hover:bg-ink-hover disabled:opacity-50 text-ivory font-semibold text-sm shadow-soft-diffused transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isProcessing ? 'Processing Image...' : 'Publish Photo to Gallery'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
              <h2 className="font-display font-normal text-2xl text-ink mb-6">
                Current Gallery Photos ({gallery.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {gallery.map((photo) => (
                  <div
                    key={photo.id}
                    className="rounded-2xl border border-border overflow-hidden bg-canvas/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/3] bg-canvas overflow-hidden relative">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-ink text-ivory text-[10px] font-sans font-medium px-2 py-0.5 rounded-md uppercase tracking-[0.08em]">
                          {photo.category}
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-ink line-clamp-2">
                          {photo.title}
                        </h3>
                        <div className="text-xs text-ink/80 mt-1 flex items-center justify-between tabular-nums">
                          <span>{photo.location}</span>
                          <span className="font-medium text-ink">{photo.speed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-ivory border-t border-border flex items-center justify-between">
                      <span className="text-[11px] font-sans tabular-nums text-ink/75">
                        {photo.uploadedAt}
                      </span>
                      <button
                        onClick={() => handleDeleteGalleryItem(photo.id)}
                        className="text-xs text-ink font-semibold px-2 py-1.5 rounded-lg border border-terracotta/60 hover:bg-terracotta/15 transition-colors duration-150 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-terracotta" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROCESSING LINES PHOTOS (12 LINES) */}
        {activeTab === 'processing-lines' && (
          <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
            <div className="border-b border-border pb-4 mb-6">
              <h2 className="font-display font-normal text-2xl text-ink">
                Update Processing Line Photos (12 Lines)
              </h2>
              <p className="text-xs text-ink/80 mt-0.5">
                Select any of the 12 processing lines below to view its current live image and upload a new machine photo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 border-r border-border pr-0 lg:pr-6 space-y-1">
                <div className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-3">
                  Select Line to Manage
                </div>

                <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                  {PROCESSING_LINES.map((line) => {
                    const isSelected = line.slug === selectedLineSlug;
                    const hasCustomPhoto = !!processingLinesMedia[line.slug]?.mainImage;
                    return (
                      <button
                        key={line.id}
                        onClick={() => {
                          setSelectedLineSlug(line.slug);
                          setLineImagePreview(null);
                        }}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold transition-colors duration-150 flex items-center justify-between ${
                          isSelected
                            ? 'bg-ink text-ivory'
                            : 'hover:bg-canvas text-ink'
                        }`}
                      >
                        <span>{line.name}</span>
                        {hasCustomPhoto && (
                          <span className="w-2 h-2 rounded-full bg-sage shrink-0" title="Custom Photo Active" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-normal text-2xl text-ink">
                      {selectedLineObj.name}
                    </h3>
                    <button
                      onClick={() => navigate(`/products/processing-line/${selectedLineObj.slug}`)}
                      className="text-xs font-semibold text-ink hover:underline decoration-sage underline-offset-4 flex items-center gap-1"
                    >
                      <span>Preview Live Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-sage" />
                    </button>
                  </div>
                  <p className="text-xs text-ink/80">
                    {selectedLineObj.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                      Active Live Image:
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-canvas relative">
                      <img
                        src={activeCustomLinePhoto || selectedLineObj.image}
                        alt={selectedLineObj.name}
                        className="w-full h-full object-cover"
                      />
                      {activeCustomLinePhoto && (
                        <div className="absolute top-2 left-2 bg-ink text-ivory text-[10px] font-sans font-medium px-2 py-0.5 rounded-md">
                          Custom Upload Active
                        </div>
                      )}
                    </div>
                    {activeCustomLinePhoto && (
                      <button
                        onClick={() => handleResetLinePhoto(selectedLineSlug)}
                        className="text-xs text-ink underline decoration-terracotta mt-2 block"
                      >
                        Reset to default factory photo
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                      Upload New Photo:
                    </div>

                    <div
                      onClick={() => lineFileInputRef.current?.click()}
                      className="border-2 border-dashed border-border-strong hover:border-sage bg-canvas/60 hover:bg-canvas rounded-2xl p-4 text-center cursor-pointer transition-colors duration-150 aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      {lineImagePreview ? (
                        <img
                          src={lineImagePreview}
                          alt="New Selection"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-sage mb-2" />
                          <div className="text-xs font-semibold text-ink">
                            Select New Photo for {selectedLineObj.name}
                          </div>
                          <div className="text-[11px] text-ink/75 mt-1">
                            PNG, JPG, WebP
                          </div>
                        </>
                      )}
                      <input
                        ref={lineFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLineFileSelect}
                        className="hidden"
                      />
                    </div>

                    {lineImagePreview && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveProcessingLinePhoto}
                          className="flex-1 py-2.5 px-4 bg-ink hover:bg-ink-hover text-ivory font-semibold text-xs rounded-xl transition-colors duration-150"
                        >
                          Save Photo to Live Line
                        </button>
                        <button
                          type="button"
                          onClick={() => setLineImagePreview(null)}
                          className="py-2.5 px-3 bg-ivory border border-ink hover:bg-canvas text-ink text-xs font-semibold rounded-xl transition-colors duration-150"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EQUIPMENTS PHOTOS (29 UNITS) */}
        {activeTab === 'equipments' && (
          <div className="bg-ivory rounded-2xl border border-border p-6 sm:p-8 shadow-soft-diffused">
            <div className="border-b border-border pb-4 mb-6">
              <h2 className="font-display font-normal text-2xl text-ink">
                Upload Machinery Photos for Equipments (29 Units)
              </h2>
              <p className="text-xs text-ink/80 mt-0.5">
                Attach dedicated machine photos to any of the 29 equipment boxes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 border-r border-border pr-0 lg:pr-6 space-y-1">
                <div className="text-xs font-sans font-semibold uppercase tracking-[0.1em] text-ink mb-3">
                  Select Equipment Unit (29 Total)
                </div>

                <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
                  {EQUIPMENTS_LIST.map((name, idx) => {
                    const isSelected = name === selectedEquipment;
                    const hasPhoto = !!equipmentsMedia[name]?.imageUrl;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedEquipment(name);
                          setEquipmentImagePreview(null);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold tabular-nums transition-colors duration-150 flex items-center justify-between ${
                          isSelected
                            ? 'bg-ink text-ivory'
                            : 'hover:bg-canvas text-ink'
                        }`}
                      >
                        <span className="truncate pr-2">
                          #{String(idx + 1).padStart(2, '0')} {name}
                        </span>
                        {hasPhoto && (
                          <span className="w-2 h-2 rounded-full bg-sage shrink-0" title="Photo Attached" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h3 className="font-display font-normal text-2xl text-ink">
                    {selectedEquipment}
                  </h3>
                  <p className="text-xs text-ink/80 mt-1">
                    Heavy industrial auxiliary unit for metal rolling mills
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div>
                    <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                      Current Unit Photo:
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-canvas relative flex items-center justify-center text-center p-4">
                      {equipmentsMedia[selectedEquipment]?.imageUrl ? (
                        <img
                          src={equipmentsMedia[selectedEquipment].imageUrl}
                          alt={selectedEquipment}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-xs text-ink/70">
                          No Photo Uploaded Yet
                        </div>
                      )}
                    </div>
                    {equipmentsMedia[selectedEquipment]?.imageUrl && (
                      <button
                        onClick={() => handleRemoveEquipmentPhoto(selectedEquipment)}
                        className="text-xs text-ink underline decoration-terracotta mt-2 block font-semibold"
                      >
                        Remove this photo
                      </button>
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-sans font-semibold text-ink uppercase tracking-[0.1em] mb-2">
                      Upload Unit Photo:
                    </div>

                    <div
                      onClick={() => equipmentFileInputRef.current?.click()}
                      className="border-2 border-dashed border-border-strong hover:border-sage bg-canvas/60 hover:bg-canvas rounded-2xl p-4 text-center cursor-pointer transition-colors duration-150 aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden"
                    >
                      {equipmentImagePreview ? (
                        <img
                          src={equipmentImagePreview}
                          alt="New Selection"
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-sage mb-2" />
                          <div className="text-xs font-semibold text-ink">
                            Select Photo
                          </div>
                          <div className="text-[11px] text-ink/75 mt-1">
                            PNG, JPG, WebP
                          </div>
                        </>
                      )}
                      <input
                        ref={equipmentFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleEquipmentFileSelect}
                        className="hidden"
                      />
                    </div>

                    {equipmentImagePreview && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveEquipmentPhoto}
                          className="flex-1 py-2.5 px-4 bg-ink hover:bg-ink-hover text-ivory font-semibold text-xs rounded-xl transition-colors duration-150"
                        >
                          Save Photo
                        </button>
                        <button
                          type="button"
                          onClick={() => setEquipmentImagePreview(null)}
                          className="py-2.5 px-3 bg-ivory border border-ink hover:bg-canvas text-ink text-xs font-semibold rounded-xl transition-colors duration-150"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-border text-xs text-ink flex items-center justify-between gap-4">
                  <span>
                    Photos attached here will appear directly on the <strong>Equipments</strong> page cards.
                  </span>
                  <button
                    onClick={() => navigate('/products/equipments')}
                    className="text-xs font-semibold text-ink hover:underline decoration-sage underline-offset-4 shrink-0"
                  >
                    View Equipments Page →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
