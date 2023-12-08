import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from "../src/components/Home/Home"
import Sites from "../src/components/Sites/Sites"
import RouteProtection from '../src/components/RouteProtection/RouteProtection';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<RouteProtection />} />
        <Route path="/sites" element={<Sites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
