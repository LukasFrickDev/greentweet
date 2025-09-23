import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import { useSelector } from "react-redux";
// Update the import path below to where your store's RootState type is actually exported
import type { RootState } from "./store";

function App() {
  const access = useSelector((state: RootState) => state.auth.access);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={access ? <Feed /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;


