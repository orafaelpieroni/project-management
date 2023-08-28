import "./App.css";
import MembersBar from "./components/MembersBar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ThemeProvider } from "./providers/ThemeProvider";

function App() {
  const user = undefined;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex">
        <BrowserRouter>
          {user ? (
            <>
              <Sidebar />
              <div className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </div>
              <MembersBar />
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
