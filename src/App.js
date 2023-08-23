import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from "../src/components/Home/Home"
import PostForm from "../src/components/PostForm/PostForm"
import Navbar from "../src/components/Navbar"
function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/post" element={<PostForm/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
