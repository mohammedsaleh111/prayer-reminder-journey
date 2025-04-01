
import React, { useState } from 'react';
import { PrayerType } from '@/models/prayer';

interface PrayerCounterProps {
  prayerType: PrayerType;
  onCountSubmit: (prayer: PrayerType, count: number, timeUnit: string) => void;
}

const PrayerCounter: React.FC<PrayerCounterProps> = ({ 
  prayerType, 
  onCountSubmit 
}) => {
  const [count, setCount] = useState(1);
  const [timeUnit, setTimeUnit] = useState('days');
  
  const calculateTotalPrayers = () => {
    let prayersPerUnit = 1;
    
    switch (timeUnit) {
      case 'days':
        prayersPerUnit = 1;
        break;
      case 'weeks':
        prayersPerUnit = 7;
        break;
      case 'months':
        prayersPerUnit = 30;
        break;
      case 'years':
        prayersPerUnit = 365;
        break;
      default:
        prayersPerUnit = 1;
    }
    
    return count * prayersPerUnit;
  };
  
  const handleSubmit = () => {
    onCountSubmit(prayerType, calculateTotalPrayers(), timeUnit);
  };
  
  return (
    <div className="p-4 bg-islamic-light rounded-lg border border-islamic-primary/20">
      <h3 className="text-lg font-amiri text-islamic-primary mb-3">
        Add missed {prayerType} prayers
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-islamic-dark mb-1">Amount</label>
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
          />
        </div>
        
        <div>
          <label className="block text-sm text-islamic-dark mb-1">Time Unit</label>
          <select
            value={timeUnit}
            onChange={(e) => setTimeUnit(e.target.value)}
            className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
          >
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center border-t border-islamic-primary/10 pt-3">
        <p className="text-islamic-dark">
          Total: <span className="font-bold">{calculateTotalPrayers()}</span> prayers
        </p>
        
        <button
          onClick={handleSubmit}
          className="bg-islamic-primary text-white py-2 px-4 rounded hover:bg-islamic-accent transition-colors"
        >
          Add Prayers
        </button>
      </div>
    </div>
  );
};

export default PrayerCounter;
