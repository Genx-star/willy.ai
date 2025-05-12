import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import CreateContent from '../pages/CreateContent';
import History from '../pages/History';
import Settings from '../pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateContent />} />
      <Route path="/history" element={<History />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
};

export default AppRoutes;