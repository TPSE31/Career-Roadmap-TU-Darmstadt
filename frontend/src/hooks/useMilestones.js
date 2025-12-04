import { useState, useEffect } from 'react';
import milestoneService from '../services/milestoneService';

export const useMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const data = await milestoneService.getAllMilestones();
        setMilestones(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const updateMilestone = async (milestoneId, completed) => {
    try {
      await milestoneService.updateMilestoneStatus(milestoneId, completed);
      const data = await milestoneService.getAllMilestones();
      setMilestones(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return { milestones, loading, error, updateMilestone };
};

export const useUpcomingMilestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const data = await milestoneService.getUpcomingMilestones();
        setMilestones(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMilestones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  return { milestones, loading, error };
};
