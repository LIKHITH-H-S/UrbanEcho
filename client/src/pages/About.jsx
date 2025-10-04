// /pages/About.jsx
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-content">
        <div className="about-header">
          <h1 className="about-title">About UrbanEcho</h1>
          <p className="about-description">
            UrbanEcho is a platform for citizens to report infrastructure issues such as roads,
            sanitation, water supply, and more. Community members can upvote important issues to
            help prioritize action.
          </p>
        </div>

        <div className="about-section">
          <h3>Our Mission</h3>
          <p>
            To create a more responsive and accountable urban infrastructure system by connecting
            citizens directly with local authorities and service providers. We believe that every
            voice matters and every issue deserves attention.
          </p>
        </div>

        <div className="about-section">
          <h3>How It Works</h3>
          <ul>
            <li><strong>Report:</strong> Citizens can easily report infrastructure issues with photos and detailed descriptions</li>
            <li><strong>Vote:</strong> Community members upvote the most critical issues to help prioritize solutions</li>
            <li><strong>Track:</strong> Follow progress in real-time and get notified when issues are resolved</li>
            <li><strong>Impact:</strong> See tangible improvements in your community through collective action</li>
          </ul>
        </div>

        <div className="about-section">
          <h3>Benefits</h3>
          <ul>
            <li>Direct communication channel between citizens and local government</li>
            <li>Data-driven prioritization of infrastructure improvements</li>
            <li>Increased transparency in public service delivery</li>
            <li>Community engagement and civic participation</li>
            <li>Faster resolution of local issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
