
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Prediction from './Prediction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/prediction" element={<Prediction />} />
      </Routes>

    </Router>
  
  );
}

export default App;
