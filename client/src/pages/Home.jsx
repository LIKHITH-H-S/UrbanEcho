import React, { useState } from 'react';
import NewProblemForm from '../components/NewProblemForm';
import ProblemList from '../components/ProblemList';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProblemCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div>
      <h1>UrbanEcho Problem Reporter</h1>
      <NewProblemForm onProblemCreated={handleProblemCreated} />
      <ProblemList key={refreshKey} />
    </div>
  );
};

export default Home;