import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from "../src/components/Home/Home"
import PostForm from "../src/components/PostForm/PostForm"
import Navbar from "../src/components/Navbar/Navbar"
import Sites from "../src/components/Sites/Sites"
import Footer from "../src/components/Footer/Footer"
import RouteProtection from '../src/components/RouteProtection/RouteProtection';
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/post" element={<RouteProtection/>}/>
      <Route path="/sites" element={<Sites/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
  );
}

export default App;
