import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-red-950 flex flex-col items-center justify-center p-8 gap-8">
      <div className="text-center text-white space-y-2">
        <h1 className="text-6xl font-bold tracking-tight" style={{ fontFamily: 'serif' }}>象棋</h1>
        <p className="text-xl opacity-80">Xiangqi — Chinese Chess</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => navigate('/game')}
          className="flex-1 py-4 bg-white text-red-900 font-bold text-lg rounded-xl
            hover:bg-red-50 transition-colors shadow-lg"
        >
          ♟ Play vs AI
        </button>
        <button
          onClick={() => navigate('/tutorial')}
          className="flex-1 py-4 bg-red-800 text-white font-bold text-lg rounded-xl
            hover:bg-red-700 transition-colors shadow-lg border border-red-600"
        >
          📖 Learn
        </button>
      </div>

      <div className="text-white/50 text-xs text-center max-w-xs">
        Learn the rules of each piece, then test your skills against the AI
      </div>
    </div>
  );
}
