import { Outlet } from "react-router";
import { AppBar } from "../../components/AppBar/AppBar";

const Layout = () => {
  return (
    <>
      <AppBar />
      <Outlet />
    </>
  );
};

export default Layout;
