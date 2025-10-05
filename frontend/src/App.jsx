import { memo } from 'react';
import ExoPredict from './components/ExoPredict';

const App = () => {
  return (
    <div className="min-h-screen space-bg">
      {/* Nebula background effects */}
      <div className="nebula-glow nebula-1"></div>
      <div className="nebula-glow nebula-2"></div>
      <div className="nebula-glow nebula-3"></div>
      
      {/* Content with higher z-index */}
      <div className="relative z-10">
        <header className="text-center py-8 px-4 text-white">
          <h1 className="text-4xl font-bold m-0 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
            The Blankspace
          </h1>
          <p className="text-lg text-blue-100 mt-2">
            🌌 NASA Exoplanet Prediction System
          </p>
        </header>
        <main className="p-4">
          <ExoPredict />
        </main>
      </div>
    </div>
  );
};

export default memo(App);