
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  PrayerMakeupPlan, 
  MakeupStrategy, 
  NotificationStrategy,
  MissedPrayer,
  PrayerType
} from '../models/prayer';
import { v4 as uuidv4 } from 'uuid';

interface MakeupPlanState {
  plans: PrayerMakeupPlan[];
  activePlanId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MakeupPlanState = {
  plans: [],
  activePlanId: null,
  loading: false,
  error: null
};

export const makeupPlanSlice = createSlice({
  name: 'makeupPlan',
  initialState,
  reducers: {
    createPlan: (state, action: PayloadAction<{
      name: string;
      targetPrayers: MissedPrayer[];
      makeupStrategy: MakeupStrategy;
      notificationStrategy: NotificationStrategy;
    }>) => {
      const { name, targetPrayers, makeupStrategy, notificationStrategy } = action.payload;
      
      const totalCount = targetPrayers.reduce((sum, prayer) => sum + prayer.count, 0);
      
      const newPlan: PrayerMakeupPlan = {
        id: uuidv4(),
        name,
        targetPrayers,
        makeupStrategy,
        notificationStrategy,
        createdAt: new Date().toISOString(),
        completedCount: 0,
        totalCount
      };
      
      state.plans.push(newPlan);
      
      // Set as active plan if it's the first one
      if (state.plans.length === 1) {
        state.activePlanId = newPlan.id;
      }
    },
    
    setActivePlan: (state, action: PayloadAction<string>) => {
      state.activePlanId = action.payload;
    },
    
    markPrayerCompletedInPlan: (state, action: PayloadAction<{
      planId: string;
      prayerType: PrayerType;
      count: number;
    }>) => {
      const { planId, prayerType, count } = action.payload;
      
      const planIndex = state.plans.findIndex(plan => plan.id === planId);
      
      if (planIndex >= 0) {
        const plan = state.plans[planIndex];
        
        // Find the prayer in the plan
        const prayerIndex = plan.targetPrayers.findIndex(
          prayer => prayer.prayerType === prayerType
        );
        
        if (prayerIndex >= 0) {
          const prayer = plan.targetPrayers[prayerIndex];
          const newCount = Math.max(0, prayer.count - count);
          
          // Update prayer count
          state.plans[planIndex].targetPrayers[prayerIndex].count = newCount;
          
          // Update plan completed count
          state.plans[planIndex].completedCount += 
            Math.min(count, prayer.count);
          
          // Remove prayer from plan if count is 0
          if (newCount === 0) {
            state.plans[planIndex].targetPrayers = 
              plan.targetPrayers.filter(p => p.prayerType !== prayerType);
          }
        }
      }
    },
    
    deletePlan: (state, action: PayloadAction<string>) => {
      const planId = action.payload;
      
      // Remove the plan
      state.plans = state.plans.filter(plan => plan.id !== planId);
      
      // Reset active plan if it was deleted
      if (state.activePlanId === planId) {
        state.activePlanId = state.plans.length > 0 ? state.plans[0].id : null;
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
  createPlan, 
  setActivePlan, 
  markPrayerCompletedInPlan,
  deletePlan,
  setLoading,
  setError
} = makeupPlanSlice.actions;

export default makeupPlanSlice.reducer;
