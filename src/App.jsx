import "./styles/app.scss";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Outlet />
    </div>
  );
}

export default App;
