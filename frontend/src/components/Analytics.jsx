import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = ({ quizId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [quizId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/quiz/${quizId}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading analytics...</div>;
  if (!analytics) return <div>No analytics available</div>;

  return (
    <div className="analytics-container">
      <h2>Quiz Analytics</h2>
      <div className="summary">
        <p>Total Students: {analytics.totalStudents}</p>
      </div>

      <div className="questions-analytics">
        {Object.entries(analytics.questionAnalytics).map(([questionId, data]) => (
          <div key={questionId} className="question-stat">
            <h3>Question {questionId}</h3>
            <div className="options-stat">
              {['A', 'B', 'C', 'D'].map(option => (
                <div key={option} className="option-stat">
                  <h4>Option {option}</h4>
                  <p>Count: {data[option].count}</p>
                  <div className="students-list">
                    <h5>Students:</h5>
                    <ul>
                      {data[option].students.map((student, idx) => (
                        <li key={idx}>{student.studentName}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
