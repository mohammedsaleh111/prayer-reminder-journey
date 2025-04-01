
import React from 'react';
import { PrayerType } from '@/models/prayer';

interface PrayerProgressBarProps {
  prayerType: PrayerType;
  completed: number;
  total: number;
}

const PrayerProgressBar: React.FC<PrayerProgressBarProps> = ({
  prayerType,
  completed,
  total
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  // Prayer-specific colors
  const getColor = () => {
    switch (prayerType) {
      case PrayerType.Fajr:
        return 'from-blue-500 to-blue-600';
      case PrayerType.Dhuhr:
        return 'from-amber-500 to-amber-600';
      case PrayerType.Asr:
        return 'from-orange-500 to-orange-600';
      case PrayerType.Maghrib:
        return 'from-red-500 to-red-600';
      case PrayerType.Isha:
        return 'from-indigo-500 to-indigo-600';
      default:
        return 'from-islamic-primary to-islamic-accent';
    }
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-islamic-dark">{prayerType}</span>
        <span className="text-sm font-medium text-islamic-dark">
          {completed}/{total} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`bg-gradient-to-r ${getColor()} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PrayerProgressBar;
