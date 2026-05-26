import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { GamePage } from './pages/GamePage';
import { TutorialPage } from './pages/TutorialPage';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route path="/tutorial/:lessonId" element={<TutorialPage />} />
      </Routes>
    </HashRouter>
  );
}
