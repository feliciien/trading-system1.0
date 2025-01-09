import './App.css';
import Trading from './pages/trading';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './components/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
 
function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/trading" element={<ProtectedRoute><Trading /></ProtectedRoute>} />
        <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
