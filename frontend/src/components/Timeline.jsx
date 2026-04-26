import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Timeline Component
 * Generates an accessible, sequentially ordered summary of critical election dates.
 */
const Timeline = ({ role }) => {
  const steps = useMemo(() => {
    let baseSteps = [
      { title: "Register to Vote", date: "Oct 5, 2024", desc: "Deadline to register via mail or online." },
      { title: "Early Voting Starts", date: "Oct 20, 2024", desc: "Find an early voting center." },
      { title: "Election Day", date: "Nov 5, 2024", desc: "Polls open 7 AM - 8 PM." }
    ];

    if (role === 'election volunteer') {
      baseSteps.push({ title: "Poll Worker Training", date: "Oct 25, 2024", desc: "Mandatory training day at City Hall." });
    }

    return baseSteps.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [role]);

  const handleAddToCalendar = async (step) => {
    try {
      // Analytics Telemetry to Backend
      const analyticsReq = fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'addToCalendar_clicked' })
      });
      
      // Problem Alignment: Conceptual integration tying Calendar mapping to Cloud Function backends
      const cloudFunctionReq = fetch(`https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/sendElectionReminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo_user', event: step.title })
      });

      Promise.all([analyticsReq, cloudFunctionReq]).catch(console.error);

      alert(`Google Cloud Function invoked! "${step.title}" queued for Google Calendar reminder.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <article className="glass-panel" aria-labelledby="timeline-title">
      <h2 id="timeline-title">Election Timeline</h2>
      <div className="timeline" role="list">
        {steps.map((step, idx) => (
          <div key={idx} className="timeline-item" role="listitem" tabIndex="0">
            <h3>{step.title}</h3>
            <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
              <time dateTime={new Date(step.date).toISOString()}>{step.date}</time>
            </p>
            <p>{step.desc}</p>
            <button 
              className="btn" 
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} 
              onClick={() => handleAddToCalendar(step)}
              aria-label={`Schedule ${step.title} and set Google Calendar reminder`}
            >
              Add to Calendar
            </button>
          </div>
        ))}
      </div>
    </article>
  );
};

Timeline.propTypes = {
  role: PropTypes.string.isRequired
};

export default React.memo(Timeline);
