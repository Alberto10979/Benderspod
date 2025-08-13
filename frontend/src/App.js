
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Prediction from './Prediction';
import About from './About';
import Homepage from './Homepage';
import Blog from './Blog';
import Gallery from './Gallery';
import Events from './Events';
import Partners from './Partners';
import Shop from './Shop';
import Predictiontest from './Predictiontest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
         <Route path="/" element={<Homepage />} />
          <Route path="/blog" element={<Blog />} />
           <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
             <Route path="/partners" element={<Partners />} />
             <Route path="/prediction" element={<Prediction />} />
              <Route path="/about" element={<About/>}/>
               <Route path="/shop" element={<Shop />} />
               <Route path="/predictiontest" element={<Predictiontest />} />




      </Routes>

    </Router>
    </QueryClientProvider>
    
  
  );
}

export default App;
