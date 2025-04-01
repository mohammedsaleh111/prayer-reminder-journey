
import React, { useState } from 'react';
import IslamicLayout from '@/components/IslamicLayout';
import IslamicCard from '@/components/IslamicCard';
import PrayerProgressBar from '@/components/PrayerProgressBar';
import { PrayerType } from '@/models/prayer';
import { useAppSelector } from '@/state/hooks';

const Progress = () => {
  const [timeRange, setTimeRange] = useState('daily');
  
  const { dailyProgress } = useAppSelector(state => state.progress);
  const { plans } = useAppSelector(state => state.makeupPlan);
  
  // Calculate stats
  const getTotalPrayersCompleted = () => {
    return dailyProgress.reduce((sum, progress) => sum + progress.count, 0);
  };
  
  const getPrayersCompletedByType = (prayerType: PrayerType) => {
    return dailyProgress
      .filter(progress => progress.prayerType === prayerType)
      .reduce((sum, progress) => sum + progress.count, 0);
  };
  
  const getTotalPrayersInAllPlans = () => {
    return plans.reduce((sum, plan) => sum + plan.totalCount, 0);
  };
  
  const getTotalPrayersRemainingInAllPlans = () => {
    const totalPrayers = getTotalPrayersInAllPlans();
    const completedPrayers = plans.reduce((sum, plan) => sum + plan.completedCount, 0);
    return totalPrayers - completedPrayers;
  };
  
  // Filter progress based on time range
  const getFilteredProgress = () => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    switch (timeRange) {
      case 'daily':
        return dailyProgress.filter(progress => progress.date === todayStr);
      
      case 'weekly': {
        const oneWeekAgo = new Date(now);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];
        
        return dailyProgress.filter(progress => progress.date >= oneWeekAgoStr);
      }
      
      case 'monthly': {
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
        
        return dailyProgress.filter(progress => progress.date >= oneMonthAgoStr);
      }
      
      case 'yearly': {
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0];
        
        return dailyProgress.filter(progress => progress.date >= oneYearAgoStr);
      }
      
      default:
        return dailyProgress;
    }
  };
  
  const filteredProgress = getFilteredProgress();
  
  const getPrayersCompletedInTimeRange = (prayerType?: PrayerType) => {
    if (prayerType) {
      return filteredProgress
        .filter(progress => progress.prayerType === prayerType)
        .reduce((sum, progress) => sum + progress.count, 0);
    }
    
    return filteredProgress.reduce((sum, progress) => sum + progress.count, 0);
  };
  
  // Group by date for the chart
  const groupProgressByDate = () => {
    const groupedData: Record<string, Record<PrayerType, number>> = {};
    
    filteredProgress.forEach(progress => {
      if (!groupedData[progress.date]) {
        groupedData[progress.date] = {
          [PrayerType.Fajr]: 0,
          [PrayerType.Dhuhr]: 0,
          [PrayerType.Asr]: 0,
          [PrayerType.Maghrib]: 0,
          [PrayerType.Isha]: 0
        };
      }
      
      groupedData[progress.date][progress.prayerType] += progress.count;
    });
    
    return Object.entries(groupedData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, prayers]) => ({
        date: new Date(date).toLocaleDateString(),
        ...prayers
      }));
  };
  
  const chartData = groupProgressByDate();
  
  return (
    <IslamicLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-amiri text-islamic-primary mb-6 text-center">
          Prayer Makeup Progress
        </h1>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-islamic-primary/10">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-islamic-primary/10">
              <div className="p-4 text-center">
                <p className="text-sm text-islamic-dark mb-1">Total Completed</p>
                <p className="text-2xl font-bold text-islamic-primary">
                  {getTotalPrayersCompleted()}
                </p>
              </div>
              
              <div className="p-4 text-center">
                <p className="text-sm text-islamic-dark mb-1">Remaining</p>
                <p className="text-2xl font-bold text-islamic-primary">
                  {getTotalPrayersRemainingInAllPlans()}
                </p>
              </div>
              
              <div className="p-4 text-center">
                <p className="text-sm text-islamic-dark mb-1">Active Plans</p>
                <p className="text-2xl font-bold text-islamic-primary">
                  {plans.length}
                </p>
              </div>
              
              <div className="p-4 text-center">
                <p className="text-sm text-islamic-dark mb-1">Most Makeup</p>
                <p className="text-2xl font-bold text-islamic-primary">
                  {Object.values(PrayerType).reduce((max, prayer) => {
                    const count = getPrayersCompletedByType(prayer);
                    return count > max.count ? { prayer, count } : max;
                  }, { prayer: PrayerType.Fajr, count: 0 }).prayer}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            {['daily', 'weekly', 'monthly', 'yearly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-4 py-2 text-sm font-medium border
                  ${timeRange === range 
                    ? 'bg-islamic-primary text-white border-islamic-primary' 
                    : 'bg-white text-islamic-dark border-islamic-primary/20 hover:bg-islamic-primary/10'}
                  ${range === 'daily' ? 'rounded-l-md' : ''}
                  ${range === 'yearly' ? 'rounded-r-md' : ''}
                `}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <IslamicCard title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Prayer Breakdown`}>
            {getPrayersCompletedInTimeRange() > 0 ? (
              <div className="space-y-3">
                {Object.values(PrayerType).map((prayer) => {
                  const count = getPrayersCompletedInTimeRange(prayer);
                  return (
                    <div key={prayer} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{prayer}</span>
                      <span className="text-sm font-bold text-islamic-primary">{count}</span>
                    </div>
                  );
                })}
                <div className="pt-2 mt-2 border-t border-islamic-primary/10">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-islamic-primary">
                      {getPrayersCompletedInTimeRange()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-islamic-dark">
                No prayers completed in this time period.
              </p>
            )}
          </IslamicCard>
          
          <IslamicCard title="Prayer Makeup Distribution">
            {getPrayersCompletedInTimeRange() > 0 ? (
              <div className="py-2">
                {Object.values(PrayerType).map((prayer) => {
                  const count = getPrayersCompletedInTimeRange(prayer);
                  const total = getPrayersCompletedInTimeRange();
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={prayer} className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{prayer}</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: 
                              prayer === PrayerType.Fajr ? '#3B82F6' :
                              prayer === PrayerType.Dhuhr ? '#F59E0B' :
                              prayer === PrayerType.Asr ? '#F97316' :
                              prayer === PrayerType.Maghrib ? '#EF4444' :
                              '#6366F1'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-4 text-islamic-dark">
                No data available for this time period.
              </p>
            )}
          </IslamicCard>
        </div>
        
        <IslamicCard title={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Prayer History`}>
          {chartData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-islamic-primary/10">
                    <th className="text-left py-2 px-4">Date</th>
                    {Object.values(PrayerType).map((prayer) => (
                      <th key={prayer} className="text-center py-2 px-4">{prayer}</th>
                    ))}
                    <th className="text-right py-2 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr key={index} className="border-b border-islamic-primary/10">
                      <td className="py-3 px-4">{item.date}</td>
                      {Object.values(PrayerType).map((prayer) => (
                        <td key={prayer} className="py-3 px-4 text-center">
                          {item[prayer]}
                        </td>
                      ))}
                      <td className="py-3 px-4 text-right font-medium">
                        {Object.values(PrayerType).reduce((sum, prayer) => sum + item[prayer], 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-islamic-dark">
              No prayer history available for this time period.
            </p>
          )}
        </IslamicCard>
      </div>
    </IslamicLayout>
  );
};

export default Progress;
