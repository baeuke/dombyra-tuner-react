import {Tuner} from './components/tuner';
import { Prima } from './components/prima';

import {Routes, Route} from "react-router-dom";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Tuner/>} />
        <Route path="/qobyz" element={<Prima/>} />
      </Routes>
      
    </div>
  );
}

export default App;
