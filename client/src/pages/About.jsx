// /pages/About.jsx
import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

const About = () => {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <AnimatedBackground />
      <div style={{ padding: '2rem' }}>
        <h2>About UrbanEcho</h2>
        <p>
          UrbanEcho is a platform for citizens to report infrastructure issues such as roads,
          sanitation, water supply, and more. Community members can upvote important issues to
          help prioritize action.
        </p>
      </div>
    </div>
  );
};

export default About;
