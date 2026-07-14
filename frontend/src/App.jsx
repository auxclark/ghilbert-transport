import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Roosters from './pages/Roosters';
import RoosterDetail from './pages/RoosterDetail';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import TrackBooking from './pages/TrackBooking';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roosters" element={<Roosters />} />
          <Route path="/roosters/:id" element={<RoosterDetail />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirmation/:id" element={<Confirmation />} />
          <Route path="/track" element={<TrackBooking />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
