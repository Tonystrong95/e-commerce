import "./App.css";
import RegisterUser from "./components/RegisterUser.js";
import Login from "./components/Login.js";
import Home from "./components/Home.js";
import Trolley from "./components/Trolley.js";
import Reviews from "./components/Reviews.js";
import Admin from "./components/Admin.js";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<RegisterUser />} />
        <Route path="Login" element={<Login />} />
        <Route path="Home" element={<Home />} />
        <Route path="Trolley" element={<Trolley />} />
        <Route path="Reviews" element={<Reviews />} />
        <Route path="Admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
