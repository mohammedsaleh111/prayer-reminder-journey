
import React, { useState } from 'react';
import IslamicLayout from '@/components/IslamicLayout';
import IslamicCard from '@/components/IslamicCard';
import PrayerProgressBar from '@/components/PrayerProgressBar';
import { 
  PrayerType, 
  MakeupStrategy, 
  NotificationStrategy,
  MissedPrayer
} from '@/models/prayer';
import { useAppSelector, useAppDispatch } from '@/state/hooks';
import { 
  createPlan, 
  setActivePlan, 
  markPrayerCompletedInPlan,
  deletePlan
} from '@/state/makeup-plan-cubit';
import { useToast } from '@/hooks/use-toast';

const Plans = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [planName, setPlanName] = useState('');
  const [selectedPrayers, setSelectedPrayers] = useState<PrayerType[]>([]);
  const [makeupStrategy, setMakeupStrategy] = useState<MakeupStrategy>(
    MakeupStrategy.WithCurrentPrayer
  );
  const [notificationStrategy, setNotificationStrategy] = useState<NotificationStrategy>(
    NotificationStrategy.WithEachPrayer
  );
  
  const { missedPrayers } = useAppSelector(state => state.missedPrayers);
  const { plans, activePlanId } = useAppSelector(state => state.makeupPlan);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const activePlan = plans.find(plan => plan.id === activePlanId);
  
  const handlePrayerToggle = (prayer: PrayerType) => {
    setSelectedPrayers(prev => 
      prev.includes(prayer) 
        ? prev.filter(p => p !== prayer) 
        : [...prev, prayer]
    );
  };
  
  const handleCreatePlan = () => {
    if (!planName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a plan name",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedPrayers.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one prayer type",
        variant: "destructive"
      });
      return;
    }
    
    const targetPrayers: MissedPrayer[] = [];
    
    selectedPrayers.forEach(prayerType => {
      const prayer = missedPrayers.find(p => p.prayerType === prayerType);
      if (prayer) {
        targetPrayers.push({ ...prayer });
      }
    });
    
    if (targetPrayers.length === 0) {
      toast({
        title: "Error",
        description: "You don't have any missed prayers of the selected types",
        variant: "destructive"
      });
      return;
    }
    
    dispatch(createPlan({
      name: planName,
      targetPrayers,
      makeupStrategy,
      notificationStrategy
    }));
    
    toast({
      title: "Plan Created",
      description: `Created makeup plan: ${planName}`
    });
    
    // Reset form
    setPlanName('');
    setSelectedPrayers([]);
    setShowCreateForm(false);
  };
  
  const handleSetActivePlan = (planId: string) => {
    dispatch(setActivePlan(planId));
    
    toast({
      title: "Plan Activated",
      description: "Set as your active makeup plan"
    });
  };
  
  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      dispatch(deletePlan(planId));
      
      toast({
        title: "Plan Deleted",
        description: "The makeup plan has been deleted"
      });
    }
  };
  
  const handleMarkCompleted = (planId: string, prayerType: PrayerType) => {
    dispatch(markPrayerCompletedInPlan({
      planId,
      prayerType,
      count: 1
    }));
    
    toast({
      title: "Progress Updated",
      description: `Marked 1 ${prayerType} prayer as completed`
    });
  };
  
  return (
    <IslamicLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-amiri text-islamic-primary">
            Makeup Plans
          </h1>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-islamic-primary text-white py-2 px-4 rounded hover:bg-islamic-accent transition-colors"
          >
            {showCreateForm ? 'Cancel' : 'Create New Plan'}
          </button>
        </div>
        
        {showCreateForm && (
          <IslamicCard title="Create New Makeup Plan" className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-islamic-dark mb-1">Plan Name</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="E.g., Daily Makeup Plan"
                  className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm text-islamic-dark mb-1">
                  Select Prayer Types to Include
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.values(PrayerType).map((prayer) => (
                    <button
                      key={prayer}
                      onClick={() => handlePrayerToggle(prayer)}
                      className={`
                        p-2 rounded text-center text-sm
                        ${selectedPrayers.includes(prayer) 
                          ? 'bg-islamic-primary text-white' 
                          : 'bg-islamic-light border border-islamic-primary/20 text-islamic-primary hover:bg-islamic-primary/10'}
                      `}
                    >
                      {prayer}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-islamic-dark mb-1">Makeup Strategy</label>
                <select
                  value={makeupStrategy}
                  onChange={(e) => setMakeupStrategy(e.target.value as MakeupStrategy)}
                  className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                >
                  <option value={MakeupStrategy.WithCurrentPrayer}>
                    With Current Prayer
                  </option>
                  <option value={MakeupStrategy.SpecificPrayerOnly}>
                    Specific Prayer Only
                  </option>
                  <option value={MakeupStrategy.AnyTime}>
                    Any Time
                  </option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-islamic-dark mb-1">Notification Strategy</label>
                <select
                  value={notificationStrategy}
                  onChange={(e) => setNotificationStrategy(e.target.value as NotificationStrategy)}
                  className="w-full rounded border-islamic-primary/20 p-2 focus:border-islamic-primary focus:ring-1 focus:ring-islamic-primary"
                >
                  <option value={NotificationStrategy.WithEachPrayer}>
                    With Each Prayer
                  </option>
                  <option value={NotificationStrategy.SpecificTimeDaily}>
                    Specific Time Daily
                  </option>
                  <option value={NotificationStrategy.None}>
                    No Notifications
                  </option>
                </select>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={handleCreatePlan}
                  className="w-full bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </IslamicCard>
        )}
        
        {activePlan && (
          <IslamicCard title="Active Makeup Plan" className="mb-8">
            <div className="mb-4">
              <h3 className="text-xl font-medium text-islamic-primary mb-2">
                {activePlan.name}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block bg-islamic-primary/10 text-islamic-primary text-sm px-2 py-1 rounded">
                  Strategy: {activePlan.makeupStrategy.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="inline-block bg-islamic-primary/10 text-islamic-primary text-sm px-2 py-1 rounded">
                  Notifications: {activePlan.notificationStrategy.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-islamic-primary h-2.5 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(activePlan.completedCount / activePlan.totalCount) * 100}%` 
                    }}
                  ></div>
                </div>
                <p className="text-sm text-islamic-dark">
                  Overall progress: {activePlan.completedCount} of {activePlan.totalCount} prayers completed 
                  ({Math.round((activePlan.completedCount / activePlan.totalCount) * 100)}%)
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-islamic-dark mb-2">Prayer Breakdown:</h4>
                
                {activePlan.targetPrayers.length > 0 ? (
                  <div className="grid gap-4">
                    {activePlan.targetPrayers.map((prayer) => (
                      <div key={prayer.id} className="border border-islamic-primary/10 rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">{prayer.prayerType}</h5>
                          <span className="text-sm">{prayer.count} remaining</span>
                        </div>
                        
                        <button
                          onClick={() => handleMarkCompleted(activePlan.id, prayer.prayerType)}
                          className="w-full mt-2 bg-islamic-secondary text-white py-1.5 px-3 rounded text-sm hover:bg-islamic-secondary/80 transition-colors"
                        >
                          Mark One as Completed
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 bg-green-50 text-green-700 rounded">
                    All prayers in this plan have been completed!
                  </p>
                )}
              </div>
            </div>
          </IslamicCard>
        )}
        
        <IslamicCard title="All Makeup Plans">
          {plans.length > 0 ? (
            <div className="space-y-4">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-4 ${plan.id === activePlanId ? 'border-islamic-primary bg-islamic-primary/5' : 'border-islamic-primary/10'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-islamic-primary">
                      {plan.name}
                      {plan.id === activePlanId && (
                        <span className="ml-2 text-xs bg-islamic-primary text-white px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                    </h3>
                    
                    <div className="flex space-x-2">
                      {plan.id !== activePlanId && (
                        <button
                          onClick={() => handleSetActivePlan(plan.id)}
                          className="text-islamic-primary hover:text-islamic-accent text-sm"
                        >
                          Set as Active
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-islamic-dark mb-3">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-islamic-primary h-2 rounded-full"
                      style={{ 
                        width: `${(plan.completedCount / plan.totalCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-islamic-dark mb-3">
                    {plan.completedCount} of {plan.totalCount} prayers completed
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-islamic-dark">
              No makeup plans created yet.
            </p>
          )}
        </IslamicCard>
      </div>
    </IslamicLayout>
  );
};

export default Plans;
