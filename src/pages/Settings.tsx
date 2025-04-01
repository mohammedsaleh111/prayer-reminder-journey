
import React, { useState } from 'react';
import IslamicLayout from '@/components/IslamicLayout';
import IslamicCard from '@/components/IslamicCard';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('08:00');
  const [usePrayerApi, setUsePrayerApi] = useState(true);
  const [location, setLocation] = useState('');
  
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    // In a real app, we would save these settings to storage
    
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully"
    });
  };
  
  return (
    <IslamicLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-amiri text-islamic-primary mb-6 text-center">
          Settings
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <IslamicCard title="Notification Settings">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-islamic-dark">Enable Notifications</label>
                <div 
                  className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notificationsEnabled ? 'bg-islamic-primary' : 'bg-gray-300'}`}
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`}
                  />
                </div>
              </div>
              
              {notificationsEnabled && (
                <>
                  <div>
                    <label className="block text-sm text-islamic-dark mb-1">
                      Daily Reminder Time
                    </label>
                    <input
                      type="time"
                      value={notificationTime}
                      onChange={(e) => setNotificationTime(e.target.value)}
                      className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-islamic-dark">Use Prayer Time API</label>
                    <div 
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${usePrayerApi ? 'bg-islamic-primary' : 'bg-gray-300'}`}
                      onClick={() => setUsePrayerApi(!usePrayerApi)}
                    >
                      <div 
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${usePrayerApi ? 'left-7' : 'left-1'}`}
                      />
                    </div>
                  </div>
                  
                  {usePrayerApi && (
                    <div>
                      <label className="block text-sm text-islamic-dark mb-1">
                        Your Location
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </IslamicCard>
          
          <IslamicCard title="Application Settings">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-islamic-dark mb-1">
                  App Theme
                </label>
                <select
                  className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                  defaultValue="light"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-islamic-dark mb-1">
                  Language
                </label>
                <select
                  className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                  <option value="tr">Turkish</option>
                  <option value="ur">Urdu</option>
                  <option value="id">Indonesian</option>
                </select>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={handleSaveSettings}
                  className="w-full bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </IslamicCard>
        </div>
        
        <IslamicCard title="About" className="mt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-amiri text-islamic-primary">
              Prayer Makeup Tracker
            </h3>
            <p className="text-sm text-islamic-dark">
              A tool to help Muslims track and make up their missed prayers.
            </p>
            <p className="text-sm text-islamic-dark pt-2 italic">
              "Indeed, prayer has been decreed upon the believers a decree of specified times."
              <br />
              - Quran 4:103
            </p>
          </div>
        </IslamicCard>
      </div>
    </IslamicLayout>
  );
};

export default Settings;
