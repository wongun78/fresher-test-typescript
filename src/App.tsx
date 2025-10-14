import { Outlet } from "react-router-dom";
import AppHeader from "./components/app.header";

function App() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

export default App;
