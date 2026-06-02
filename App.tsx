import { useState } from 'react';
import { TabId } from './lib/types';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import DiaryPage from './pages/DiaryPage';
import MacrosPage from './pages/MacrosPage';
import HistoryPage from './pages/HistoryPage';
import StreakPage from './pages/StreakPage';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMealAdded = () => {
    setRefreshKey(k => k + 1);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onMealAdded={handleMealAdded} />;
      case 'diary':
        return <DiaryPage refreshKey={refreshKey} />;
      case 'macros':
        return <MacrosPage refreshKey={refreshKey} />;
      case 'history':
        return <HistoryPage refreshKey={refreshKey} />;
      case 'streak':
        return <StreakPage refreshKey={refreshKey} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen relative">
        <main className="pb-20 overflow-y-auto">
          {renderPage()}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;
