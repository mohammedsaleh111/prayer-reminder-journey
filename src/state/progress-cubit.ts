
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PrayerProgress, PrayerType } from '../models/prayer';

interface ProgressState {
  dailyProgress: PrayerProgress[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  dailyProgress: [],
  loading: false,
  error: null
};

export const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    addProgress: (state, action: PayloadAction<{
      prayerType: PrayerType;
      count: number;
    }>) => {
      const { prayerType, count } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      
      // Check if we already have progress for today
      const existingProgressIndex = state.dailyProgress.findIndex(
        progress => progress.date === today && progress.prayerType === prayerType
      );
      
      if (existingProgressIndex >= 0) {
        // Update existing progress
        state.dailyProgress[existingProgressIndex].count += count;
      } else {
        // Add new progress entry
        state.dailyProgress.push({
          date: today,
          prayerType,
          count
        });
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
  addProgress,
  setLoading,
  setError
} = progressSlice.actions;

export default progressSlice.reducer;
