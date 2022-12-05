import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/layout.component";
import { useTheme } from "../hooks/useTheme";
import HomePage from "../pages/home/home.page";

interface AppRoutesProp {}

const AppRoutes: React.FC<AppRoutesProp> = () => {
  const theme = useTheme();

  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoutes;
