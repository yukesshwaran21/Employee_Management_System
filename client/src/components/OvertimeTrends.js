import React, { useEffect, useState } from 'react';
import API from '../utils/api';

function OvertimeTrends() {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/attendance/summary').then(res => {
      setSummary(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h3>Overtime Trends</h3>
      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Overtime Hours</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(s => (
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.overtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OvertimeTrends;
