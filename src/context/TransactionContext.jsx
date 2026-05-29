import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    wallet: '',
    startDate: '',
    endDate: '',
    month: '',
    year: '',
    search: '',
  });

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      category: '',
      wallet: '',
      startDate: '',
      endDate: '',
      month: '',
      year: '',
      search: '',
    });
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      
      // Construct query parameters
      const params = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key]) {
          params[key] = filters[key];
        }
      });

      const { data } = await api.get('/transactions', { params });
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Could not load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transactions/analytics');
      setAnalytics(data);
      return data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Could not load financial summary analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const addTransaction = async (txData) => {
    try {
      setLoading(true);
      const { data } = await api.post('/transactions', txData);
      setTransactions((prev) => [data, ...prev]);
      toast.success('Transaction added successfully!');
      
      // Refresh analytics in the background
      fetchAnalytics();
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not add transaction';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editTransaction = async (id, txData) => {
    try {
      setLoading(true);
      const { data } = await api.put(`/transactions/${id}`, txData);
      setTransactions((prev) =>
        prev.map((tx) => (tx._id === id ? data : tx))
      );
      toast.success('Transaction updated successfully!');
      
      // Refresh analytics in the background
      fetchAnalytics();
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not update transaction';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeTransaction = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((tx) => tx._id !== id));
      toast.success('Transaction deleted');
      
      // Refresh analytics in the background
      fetchAnalytics();
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Could not delete transaction';
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        analytics,
        loading,
        filters,
        updateFilters,
        resetFilters,
        fetchTransactions,
        fetchAnalytics,
        addTransaction,
        editTransaction,
        removeTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
