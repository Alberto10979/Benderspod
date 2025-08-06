
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Prediction from './Prediction';
import About from './About';
import Homepage from './Homepage';

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Homepage />} />

        <Route path="/prediction" element={<Prediction />} />
        <Route path="/about" element={<About/>}/>
      </Routes>

    </Router>
  
  );
}

export default App;
