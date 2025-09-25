import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import ProfilePage from "./pages/Profile";
import ToastViewport from "./components/ToastViewport";
import { AuthBootstrap } from "./components/AuthBootstrap";
import { RequireAuth } from "./components/RequireAuth"
import NotificationListener from "./components/NotificationListener";



function App() {
  return (
    <Router>
      <AuthBootstrap />
      <NotificationListener />
      <ToastViewport />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feed" element={<RequireAuth><Feed /></RequireAuth>} />
        <Route path="/profile/:username" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      </Routes>
    </Router>
  );
}

export default App;


