import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/loginPage";
import { MantineProvider } from '@mantine/core';
import Register from "./pages/registerPage";
import Home from "./pages/home";
import { UserProvider } from "./UserContext";
import "survey-core/defaultV2.min.css";
import "survey-creator-core/survey-creator-core.min.css";
import '@mantine/core/styles.css';
import Builder from './components/SurveyForm/Builder';
import Viewer from './components/SurveyForm/Viewer';
import BuildTemplate from './components/SurveyForm/buildTemplate';
import ForgotPassword from './pages/forgotPassword';
import ViewForm from './pages/viewForm';
import ResponsePage from "./pages/ResponsePage";
import TemplateCreate from "./components/SurveyForm/TemplateCreate";
import CsvTablePage from "./pages/CsvTablePage";
import NoResponsePage from "./pages/NoResponsePage";

function getTokenFromCookie() {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

function ProtectedRoute({ element }) {
  const token = getTokenFromCookie();
  return token ? element : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div>
      <BrowserRouter>
      <MantineProvider>
        <UserProvider>
          <Routes>
             <Route path="/csv-table" element={<ProtectedRoute element={<CsvTablePage />} />} />
            <Route path="/login" element={<Layout />} />
              <Route path="/NoResponsePage" element={<NoResponsePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/build" element={<ProtectedRoute element={<Builder />} />} />
            <Route path="/forms"  element={<Viewer />}/>
            <Route path="/buildTemplate" element={<ProtectedRoute element={<BuildTemplate />} />} />
            <Route path="/viewForm" element={<ProtectedRoute element={<ViewForm />} />} />
            <Route path="/responses" element={<ProtectedRoute element={<ResponsePage />} />} />
            <Route path="/CreateTemplate" element={<ProtectedRoute element={<TemplateCreate />} />} />
          </Routes>
        </UserProvider>
      </MantineProvider>
    </BrowserRouter>
    </div>
    
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
