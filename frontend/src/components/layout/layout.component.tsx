import React from "react";
import { useTheme } from "../../hooks/useTheme";
import ThemeButton from "../theme-button/theme-button.component";
import logo from "../../assets/images/logo.png";
import "./layout.style.scss";
import Avatar from "../avatar/avatar.component";
import defaultAvatar from "../../assets/images/hh.png";
import { Outlet } from "react-router-dom";

interface LayoutProps {}

const Layout: React.FC<LayoutProps> = () => {
  const theme = useTheme();

  return (
    <div className={`layout ${theme}`}>
      <div className="side-bar">
        <div className="logo-container">
          <img src={logo} alt="" />
        </div>

        <div className="content">
          <ThemeButton />

          <div className="divider" />

          <Avatar size={60} src={defaultAvatar} />
        </div>
      </div>

      <div className="page-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
