import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import { PostsProvider } from './context/PostsContext'
import { ToastProvider } from "./context/toast/ToastContext";



function App() {
  return (
    <ToastProvider>
      <PostsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/feed" element={ <Feed /> } />
            <Route path="/profile/:id" element={ <Profile /> } />


          </Routes>
        </Router>
      </PostsProvider>
    </ToastProvider>

  );
}

export default App;


