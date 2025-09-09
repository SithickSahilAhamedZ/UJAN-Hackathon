
import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import Card from '../components/Card';
import { useI18n } from '../i18n';

const galleryImages = [
  "https://images.unsplash.com/photo-1617877685837-77445fa8a333?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588985121289-de58169b2b0a?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621509405423-35a0445a9a83?q=80&w=1932&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500353390906-e72151a62d73?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601368910803-9c86d885743c?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603723429399-a4d6b5592868?q=80&w=1962&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594102206192-3972282c0f24?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583124113098-939e6a24c53e?q=80&w=2070&auto=format&fit=crop",
];

interface GalleryModalProps {
  src: string;
  onClose: () => void;
}

const GalleryModal = ({ src, onClose }: GalleryModalProps) => {
  const { t } = useI18n();
  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-modal-title"
    >
      <div className="relative max-w-4xl max-h-full w-full" onClick={e => e.stopPropagation()}>
        <img src={src} alt={t('galleryModalTitle')} className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors"
          aria-label={t('closeNotification')}
        >
          <X size={24} />
        </button>
      </div>
      <h2 id="gallery-modal-title" className="sr-only">{t('galleryModalTitle')}</h2>
    </div>
  );
};


const GalleryPage = () => {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <ImageIcon size={32} className="text-orange-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('galleryTitle')}</h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleryImages.map((src, index) => (
          <Card 
            key={index} 
            className="!p-0 overflow-hidden aspect-square group"
            onClick={() => setSelectedImage(src)}
          >
            <img 
              src={src} 
              alt={`${t('galleryTitle')} image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </Card>
        ))}
      </div>
      {selectedImage && <GalleryModal src={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};
export default GalleryPage;
