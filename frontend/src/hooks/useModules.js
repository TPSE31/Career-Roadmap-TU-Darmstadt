import { useState, useEffect } from 'react';
import moduleService from '../services/moduleService';

export const useModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const data = await moduleService.getAllModules();
        setModules(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await moduleService.getAllModules();
      setModules(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { modules, loading, error, refetch };
};

export const useModule = (moduleId) => {
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!moduleId) {
      setLoading(false);
      return;
    }

    const fetchModule = async () => {
      try {
        setLoading(true);
        const data = await moduleService.getModuleById(moduleId);
        setModule(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  return { module, loading, error };
};

export const useCompletedModules = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true);
        const data = await moduleService.getCompletedModules();
        setModules(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setModules([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  return { modules, loading, error };
};
