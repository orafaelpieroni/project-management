import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Membersbar from "./components/Membersbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import { ThemeProvider } from "./providers/ThemeProviders";
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from "./components/Loading";
import Profile from "./pages/Profile/Profile";
import Chat from "./components/Chat";
import ChatButton from "./components/ChatButton";
import { useState } from "react";
import { useCollection } from "./hooks/useCollection";
import Tasks from "./pages/Tasks/Tasks";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { UserDocProvider } from "./contexts/UserDocContext";
import { UsersProvider } from "./contexts/UsersContext";
import { useDocument } from "./hooks/useDocument";

const UserDocWrapper = ({ user, children }) => {
  const { document: userDoc } = useDocument("users", user?.uid);
  if (!userDoc) return <Loading />;
  return children(userDoc);
};

function App() {
  const { user, authIsReady } = useAuthContext();
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [rerender, setRerender] = useState(false);
  const { documents: chats } = useCollection("chats");
  const { documents: users } = useCollection("users");

  if (!chats) return <Loading />;

  if (!authIsReady) return <Loading />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex">
        <Toaster />
        <BrowserRouter>
          {user ? (
            <UserDocProvider user={user}>
              <UserDocWrapper user={user}>
                {(userDoc) => (
                  <UsersProvider userDoc={userDoc}>
                    <>
                      <Sidebar rerender={rerender} />
                      <div className="flex-grow">
                        <Routes>
                          <Route exact path="/" element={<Home />} />
                          <Route
                            path="/profile"
                            element={
                              <Profile
                                rerender={rerender}
                                setRerender={setRerender}
                              />
                            }
                          />
                          <Route path="/tasks" element={<Tasks />} />
                          <Route path="*" element={<Home />} />
                        </Routes>
                      </div>
                      <Membersbar
                        users={users}
                        chats={chats}
                        setSelectedChat={setSelectedChat}
                        setChatIsOpen={setChatIsOpen}
                      />
                      {console.log("chat", chats)}
                      {chatIsOpen && (
                        <Chat
                          users={users}
                          setSelectedChat={setSelectedChat}
                          setChatIsOpen={setChatIsOpen}
                          chats={chats}
                          selectedChat={selectedChat}
                        />
                      )}
                      <ChatButton
                        setChatIsOpen={setChatIsOpen}
                        setSelectedChat={setSelectedChat}
                      />
                    </>
                  </UsersProvider>
                )}
              </UserDocWrapper>
            </UserDocProvider>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Signup />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
