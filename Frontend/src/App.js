import { Routes, Route } from "react-router-dom"
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import "./App.css"


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Homepage />}></Route>
        <Route path="/chats" exact element={<Chatpage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
