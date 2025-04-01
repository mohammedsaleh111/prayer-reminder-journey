
import { configureStore } from '@reduxjs/toolkit';
import missedPrayersReducer from './missed-prayers-cubit';
import makeupPlanReducer from './makeup-plan-cubit';
import progressReducer from './progress-cubit';

export const store = configureStore({
  reducer: {
    missedPrayers: missedPrayersReducer,
    makeupPlan: makeupPlanReducer,
    progress: progressReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
