import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from "../src/components/Home/Home"
import Sites from "../src/components/Sites/Sites"
import ResetPassword from "./components/ResetPassword/ResetPassword"
import RouteProtection from '../src/components/RouteProtection/RouteProtection';
import TandC from './components/TandC/TandC';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<RouteProtection />} />
        <Route path="/sites" element={<Sites />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword/>}/>
        <Route path="/terms-and-conditions" element={<TandC/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
