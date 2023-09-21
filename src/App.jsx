import "./App.css";
import MembersBar from "./components/MembersBar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ThemeProvider } from "./providers/ThemeProvider";
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from "./components/Loading";
import Profile from "./pages/Profile/Profile";
import Chat from "./components/Chat";
import ChatButton from "./components/ChatButton";
import { useEffect, useState } from "react";
import { useCollection } from "./hooks/useCollection";
import Tasks from "./pages/Tasks/Tasks";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { UserDocProvider } from "./contexts/UserDocContext";
import { UsersProvider } from "./contexts/UsersContext";
import { useDocument } from "./hooks/useDocument";
import useMediaQuery from "./hooks/useMediaQuery";
import Topbar from "./components/Topbar";

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
  const [selectedPriority, setSelectedPriority] = useState(null);
  const { documents: chats } = useCollection("chats");
  const { documents: users } = useCollection("users");
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    console.log(selectedPriority);
  }, [selectedPriority]);

  if (!chats) return <Loading />;

  if (!authIsReady) return <Loading />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter>
          {user ? (
            <UserDocProvider user={user}>
              <UserDocWrapper user={user}>
                {(userDoc) => (
                  <UsersProvider userDoc={userDoc}>
                    <>
                      {isMobile ? (
                        <Topbar />
                      ) : (
                        <Sidebar
                          selectedPriority={selectedPriority}
                          setSelectedPriority={setSelectedPriority}
                          rerender={rerender}
                        />
                      )}
                      <div className="mt-12 sm:mt-0 flex-grow">
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
                          <Route
                            path="/tasks"
                            element={
                              <Tasks selectedPriority={selectedPriority} />
                            }
                          />
                          <Route path="*" element={<Home />} />
                        </Routes>
                      </div>
                      {!isMobile && (
                        <MembersBar
                          users={users}
                          chats={chats}
                          setSelectedChat={setSelectedChat}
                          setChatIsOpen={setChatIsOpen}
                        />
                      )}
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
