import useDarkMode from "use-dark-mode";
import { useTheme } from "../../hooks/useTheme";
import ToggleSwitch from "../toggle-switch/toggle-switch.component";

import "./theme-button.style.scss";

interface ThemeButtonProps {}

const ThemeButton: React.FC<ThemeButtonProps> = () => {
  const darkMode = useDarkMode(true);

  const theme = useTheme();

  return (
    // <button className={`theme-button`} type="button" onClick={darkMode.toggle}>
    //   {theme === "dark-mode" ? "Light mode" : "Dark mode"}
    // </button>
    <ToggleSwitch id="theme-toggle" onClick={darkMode.toggle} />
  );
};

export default ThemeButton;
