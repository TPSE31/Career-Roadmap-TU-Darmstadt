import { useState, useEffect } from 'react';
import userService from '../services/userService';

export const useUserProgress = (userId = 1) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserProgress(userId);
        setProgress(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setProgress(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);

  return { progress, loading, error };
};

export const useUserStats = (userId = 1) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await userService.getUserStats(userId);
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
};
