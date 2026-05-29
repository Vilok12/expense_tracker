import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budgetDetails, setBudgetDetails] = useState({
    budget: 0,
    totalExpenses: 0,
    remaining: 0,
    usagePercentage: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);

  // Tracks if the user has been alerted in the current session to avoid duplicate spammy toast popups
  const [alertsTriggered, setAlertsTriggered] = useState({
    eighty: false,
    ninety: false,
    exceeded: false,
  });

  const checkBudgetThresholds = useCallback((usagePercent, budgetValue) => {
    if (budgetValue <= 0) return;

    if (usagePercent >= 100 && !alertsTriggered.exceeded) {
      toast.error('⚠️ Critical: You have exceeded your monthly budget limit!', {
        duration: 6000,
        position: 'top-right',
      });
      setAlertsTriggered((prev) => ({ ...prev, exceeded: true }));
    } else if (usagePercent >= 90 && !alertsTriggered.ninety) {
      toast.custom(
        (t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-amber-500 text-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}>
            <div className="flex-1 w-0">
              <p className="text-sm font-semibold">⚠️ Budget Warning (90% Used)</p>
              <p className="mt-1 text-xs opacity-90">
                You have spent over 90% of your planned budget. Think twice before your next purchase!
              </p>
            </div>
          </div>
        ),
        { position: 'top-right', duration: 5000 }
      );
      setAlertsTriggered((prev) => ({ ...prev, ninety: true }));
    } else if (usagePercent >= 80 && !alertsTriggered.eighty) {
      toast('💡 Info: 80% of your monthly budget has been consumed.', {
        icon: '📊',
        duration: 4000,
        position: 'top-right',
      });
      setAlertsTriggered((prev) => ({ ...prev, eighty: true }));
    }
  }, [alertsTriggered]);

  const fetchCurrentBudget = useCallback(async (month, year) => {
    try {
      setLoading(true);
      const params = {};
      if (month) params.month = month;
      if (year) params.year = year;

      const { data } = await api.get('/budgets/current', { params });
      setBudgetDetails(data);
      
      // Auto-trigger safety limit checks
      checkBudgetThresholds(data.usagePercentage, data.budget);
      return data;
    } catch (error) {
      console.error('Error fetching budget details:', error);
      // Don't show toast error here to prevent cluttering empty states
    } finally {
      setLoading(false);
    }
  }, [checkBudgetThresholds]);

  const saveBudget = async (month, year, budgetAmount) => {
    try {
      setLoading(true);
      const { data } = await api.post('/budgets', { month, year, budgetAmount });
      setBudgetDetails(data);
      
      // Reset alerts trigger for the new limit values
      setAlertsTriggered({ eighty: false, ninety: false, exceeded: false });
      
      toast.success('Monthly budget configuration saved!');
      checkBudgetThresholds(data.usagePercentage, data.budget);
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not save budget settings';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Reset alert states when month/year changes
  useEffect(() => {
    setAlertsTriggered({ eighty: false, ninety: false, exceeded: false });
  }, [budgetDetails.month, budgetDetails.year]);

  return (
    <BudgetContext.Provider
      value={{
        budgetDetails,
        loading,
        fetchCurrentBudget,
        saveBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext);
