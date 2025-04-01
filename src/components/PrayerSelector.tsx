
import React from 'react';
import { PrayerType } from '@/models/prayer';

interface PrayerSelectorProps {
  selectedPrayer: PrayerType | null;
  onChange: (prayer: PrayerType) => void;
}

const PrayerSelector: React.FC<PrayerSelectorProps> = ({ 
  selectedPrayer, 
  onChange 
}) => {
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4">
      {Object.values(PrayerType).map((prayer) => (
        <button
          key={prayer}
          onClick={() => onChange(prayer)}
          className={`
            p-3 rounded-lg text-center transition-all
            ${selectedPrayer === prayer 
              ? 'bg-islamic-primary text-white shadow-md' 
              : 'bg-islamic-light border border-islamic-primary/20 text-islamic-primary hover:bg-islamic-primary/10'}
          `}
        >
          <p className="font-amiri">{prayer}</p>
        </button>
      ))}
    </div>
  );
};

export default PrayerSelector;
