
import React from 'react';
import { Link } from 'react-router-dom';
import IslamicLayout from '@/components/IslamicLayout';
import IslamicCard from '@/components/IslamicCard';
import { useAppSelector } from '@/state/hooks';

const Index = () => {
  const { missedPrayers } = useAppSelector(state => state.missedPrayers);
  const { activePlanId, plans } = useAppSelector(state => state.makeupPlan);
  
  const activePlan = plans.find(plan => plan.id === activePlanId);
  const totalMissedPrayers = missedPrayers.reduce((sum, prayer) => sum + prayer.count, 0);
  
  return (
    <IslamicLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-amiri text-islamic-primary mb-2">
            Prayer Makeup Tracker
          </h1>
          <p className="text-islamic-accent max-w-2xl mx-auto">
            Track and make up your missed prayers with a structured plan that fits your schedule.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <IslamicCard title="Missed Prayers Overview">
            {totalMissedPrayers > 0 ? (
              <>
                <p className="mb-4">You have <span className="font-bold text-islamic-primary">{totalMissedPrayers}</span> missed prayers to make up.</p>
                <Link 
                  to="/tracker" 
                  className="block w-full text-center bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  View Missed Prayers
                </Link>
              </>
            ) : (
              <>
                <p className="mb-4">You don't have any missed prayers recorded yet.</p>
                <Link 
                  to="/tracker" 
                  className="block w-full text-center bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  Record Missed Prayers
                </Link>
              </>
            )}
          </IslamicCard>
          
          <IslamicCard title="Active Makeup Plan">
            {activePlan ? (
              <>
                <h4 className="font-medium mb-2">{activePlan.name}</h4>
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-islamic-primary h-2.5 rounded-full"
                      style={{ 
                        width: `${(activePlan.completedCount / activePlan.totalCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-islamic-dark">
                    {activePlan.completedCount} of {activePlan.totalCount} prayers completed
                  </p>
                </div>
                <Link 
                  to="/plans" 
                  className="block w-full text-center bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  View Plan
                </Link>
              </>
            ) : (
              <>
                <p className="mb-4">You don't have an active makeup plan yet.</p>
                <Link 
                  to="/plans" 
                  className="block w-full text-center bg-islamic-primary text-white py-2 rounded hover:bg-islamic-accent transition-colors"
                >
                  Create Makeup Plan
                </Link>
              </>
            )}
          </IslamicCard>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <Link 
            to="/tracker" 
            className="bg-islamic-light p-4 rounded-lg border border-islamic-primary/20 text-center hover:bg-islamic-primary/10 transition-colors"
          >
            <h3 className="text-lg font-amiri text-islamic-primary mb-1">Track Prayers</h3>
            <p className="text-sm text-islamic-dark">Record missed prayers</p>
          </Link>
          
          <Link 
            to="/plans" 
            className="bg-islamic-light p-4 rounded-lg border border-islamic-primary/20 text-center hover:bg-islamic-primary/10 transition-colors"
          >
            <h3 className="text-lg font-amiri text-islamic-primary mb-1">Makeup Plans</h3>
            <p className="text-sm text-islamic-dark">Create and manage plans</p>
          </Link>
          
          <Link 
            to="/progress" 
            className="bg-islamic-light p-4 rounded-lg border border-islamic-primary/20 text-center hover:bg-islamic-primary/10 transition-colors"
          >
            <h3 className="text-lg font-amiri text-islamic-primary mb-1">Progress</h3>
            <p className="text-sm text-islamic-dark">View your makeup progress</p>
          </Link>
        </div>
      </div>
    </IslamicLayout>
  );
};

export default Index;
