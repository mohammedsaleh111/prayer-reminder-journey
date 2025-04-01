
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MissedPrayer, PrayerType } from '../models/prayer';
import { v4 as uuidv4 } from 'uuid';

interface MissedPrayersState {
  missedPrayers: MissedPrayer[];
  loading: boolean;
  error: string | null;
}

const initialState: MissedPrayersState = {
  missedPrayers: [],
  loading: false,
  error: null
};

export const missedPrayersSlice = createSlice({
  name: 'missedPrayers',
  initialState,
  reducers: {
    addMissedPrayers: (state, action: PayloadAction<{
      prayerType: PrayerType;
      count: number;
    }>) => {
      const { prayerType, count } = action.payload;
      
      // Check if prayer type already exists
      const existingPrayerIndex = state.missedPrayers.findIndex(
        prayer => prayer.prayerType === prayerType
      );
      
      if (existingPrayerIndex >= 0) {
        // Update existing prayer
        state.missedPrayers[existingPrayerIndex].count += count;
      } else {
        // Add new prayer
        state.missedPrayers.push({
          id: uuidv4(),
          prayerType,
          count
        });
      }
    },
    
    markPrayersCompleted: (state, action: PayloadAction<{
      prayerType: PrayerType;
      count: number;
    }>) => {
      const { prayerType, count } = action.payload;
      
      const existingPrayerIndex = state.missedPrayers.findIndex(
        prayer => prayer.prayerType === prayerType
      );
      
      if (existingPrayerIndex >= 0) {
        const currentCount = state.missedPrayers[existingPrayerIndex].count;
        const newCount = Math.max(0, currentCount - count);
        
        if (newCount === 0) {
          // Remove the prayer if count reaches 0
          state.missedPrayers = state.missedPrayers.filter(
            prayer => prayer.prayerType !== prayerType
          );
        } else {
          // Update the count
          state.missedPrayers[existingPrayerIndex].count = newCount;
        }
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  addMissedPrayers, 
  markPrayersCompleted,
  setLoading,
  setError
} = missedPrayersSlice.actions;

export default missedPrayersSlice.reducer;
