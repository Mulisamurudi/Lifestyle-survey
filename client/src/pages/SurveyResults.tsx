import { useEffect, useState } from 'react';
import api from '../../api';

interface SurveyStats {
  total: number;
  avgAge: string;
  oldest: number;
  youngest: number;
  pizzaPercent: string;
  avgEatOut: string;
}

const SurveyResults = () => {
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/results');
        if (res.data.message) {
          setMessage(res.data.message);
        } else {
          setStats(res.data);
        }
      } catch (err) {
        setMessage('Failed to load results.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (message) return <p>{message}</p>;

  return (
    <div>
      <h2>Survey Results</h2>
      {stats && (
        <ul>
          <li><strong>Total Surveys Completed:</strong> {stats.total}</li>
          <li><strong>Average Age:</strong> {stats.avgAge}</li>
          <li><strong>Oldest Participant:</strong> {stats.oldest}</li>
          <li><strong>Youngest Participant:</strong> {stats.youngest}</li>
          <li><strong>% Who Like Pizza:</strong> {stats.pizzaPercent}%</li>
          <li><strong>Average Rating for Eating Out:</strong> {stats.avgEatOut}</li>
        </ul>
      )}
    </div>
  );
};

export default SurveyResults;
