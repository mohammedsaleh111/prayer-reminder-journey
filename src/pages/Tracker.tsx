
import React, { useState } from 'react';
import IslamicLayout from '@/components/IslamicLayout';
import IslamicCard from '@/components/IslamicCard';
import PrayerSelector from '@/components/PrayerSelector';
import PrayerCounter from '@/components/PrayerCounter';
import { PrayerType } from '@/models/prayer';
import { useAppSelector, useAppDispatch } from '@/state/hooks';
import { addMissedPrayers, markPrayersCompleted } from '@/state/missed-prayers-cubit';
import { addProgress } from '@/state/progress-cubit';
import { useToast } from '@/hooks/use-toast';

const Tracker = () => {
  const [selectedPrayer, setSelectedPrayer] = useState<PrayerType | null>(null);
  const [completedCount, setCompletedCount] = useState(1);
  
  const { missedPrayers } = useAppSelector(state => state.missedPrayers);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const handlePrayerSelect = (prayer: PrayerType) => {
    setSelectedPrayer(prayer);
  };
  
  const handleAddMissedPrayers = (prayer: PrayerType, count: number, timeUnit: string) => {
    dispatch(addMissedPrayers({ prayerType: prayer, count }));
    
    toast({
      title: "Prayers Added",
      description: `Added ${count} missed ${prayer} prayers (${timeUnit})`,
    });
    
    setSelectedPrayer(null);
  };
  
  const handleMarkCompleted = () => {
    if (!selectedPrayer) return;
    
    const existingPrayer = missedPrayers.find(p => p.prayerType === selectedPrayer);
    
    if (existingPrayer) {
      const actualCount = Math.min(completedCount, existingPrayer.count);
      
      dispatch(markPrayersCompleted({
        prayerType: selectedPrayer,
        count: actualCount
      }));
      
      dispatch(addProgress({
        prayerType: selectedPrayer,
        count: actualCount
      }));
      
      toast({
        title: "Progress Updated",
        description: `Marked ${actualCount} ${selectedPrayer} prayers as completed`,
      });
      
      setSelectedPrayer(null);
      setCompletedCount(1);
    } else {
      toast({
        title: "No Missed Prayers",
        description: `You don't have any missed ${selectedPrayer} prayers to mark as completed`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <IslamicLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-amiri text-islamic-primary mb-6 text-center">
          Prayer Tracker
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <IslamicCard title="Record Missed Prayers">
            <div className="mb-4">
              <p className="text-sm text-islamic-dark mb-2">
                Select a prayer to add missed prayers:
              </p>
              <PrayerSelector
                selectedPrayer={selectedPrayer}
                onChange={handlePrayerSelect}
              />
            </div>
            
            {selectedPrayer && (
              <PrayerCounter 
                prayerType={selectedPrayer}
                onCountSubmit={handleAddMissedPrayers}
              />
            )}
          </IslamicCard>
          
          <IslamicCard title="Mark Prayers as Completed">
            <div className="mb-4">
              <p className="text-sm text-islamic-dark mb-2">
                Select a prayer to mark as completed:
              </p>
              <PrayerSelector
                selectedPrayer={selectedPrayer}
                onChange={handlePrayerSelect}
              />
            </div>
            
            {selectedPrayer && (
              <div className="p-4 bg-islamic-light rounded-lg border border-islamic-primary/20">
                <h3 className="text-lg font-amiri text-islamic-primary mb-3">
                  Mark {selectedPrayer} prayers as completed
                </h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-islamic-dark mb-1">Number of prayers</label>
                  <input
                    type="number"
                    min="1"
                    value={completedCount}
                    onChange={(e) => setCompletedCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                  />
                </div>
                
                <button
                  onClick={handleMarkCompleted}
                  className="w-full bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  Mark as Completed
                </button>
              </div>
            )}
          </IslamicCard>
        </div>
        
        <IslamicCard title="Missed Prayers Summary">
          {missedPrayers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-islamic-primary/10">
                    <th className="text-left py-2 px-4">Prayer</th>
                    <th className="text-right py-2 px-4">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {missedPrayers.map((prayer) => (
                    <tr key={prayer.id} className="border-b border-islamic-primary/10">
                      <td className="py-3 px-4">{prayer.prayerType}</td>
                      <td className="py-3 px-4 text-right font-medium">{prayer.count}</td>
                    </tr>
                  ))}
                  <tr className="bg-islamic-primary/5">
                    <td className="py-3 px-4 font-bold">Total</td>
                    <td className="py-3 px-4 text-right font-bold">
                      {missedPrayers.reduce((sum, prayer) => sum + prayer.count, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-islamic-dark">
              No missed prayers recorded yet.
            </p>
          )}
        </IslamicCard>
      </div>
    </IslamicLayout>
  );
};

export default Tracker;
