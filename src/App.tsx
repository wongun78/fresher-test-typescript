import { Outlet } from "react-router-dom";
import AppHeader from "./component/app.header";

function App() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}

export default App;
