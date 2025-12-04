import { useState, useEffect } from 'react';
import recommendationService from '../services/recommendationService';

export const useRecommendations = (userId = 1) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await recommendationService.getRecommendations(userId);
        setRecommendations(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return { recommendations, loading, error };
};

export const useHighPriorityRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await recommendationService.getHighPriorityRecommendations();
        setRecommendations(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return { recommendations, loading, error };
};
