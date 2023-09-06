import React, { useEffect, useState } from 'react';
import PerformanceMode from './components/PerformanceMode';
import FullReportPerformance from './components/FullReportPerformance';
import { connectPanel, disconnectPanel } from '@/utils/panelConnect';
import './styles/panel.scss';
import { Skeleton } from 'antd';

const Panel: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    connectPanel();

    setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => {
      disconnectPanel();
    };
  }, []);

  if (loading) {
    return <Skeleton active />
  }

  return (
      <div className="container">
        <FullReportPerformance />
        <PerformanceMode />
      </div>
  );
};

export default Panel;
