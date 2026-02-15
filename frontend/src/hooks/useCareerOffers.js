import { useState, useEffect } from 'react';
import careerOfferService from '../services/careerOfferService';

/**
 * Custom hook to fetch career offers filtered by career field
 * @param {string} careerField - The career field to filter by
 * @returns {Object} { offers, loading, error }
 */
export const useCareerOffers = (careerField) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!careerField) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await careerOfferService.getCareerOffersByField(careerField);
        setOffers(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [careerField]);

  return { offers, loading, error };
};
