import { LoginPage } from './pages/LoginPage';
import { CalendarPage } from './pages/CalendarPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
