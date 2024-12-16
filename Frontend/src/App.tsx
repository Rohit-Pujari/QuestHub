import NavBar from "./components/NavBar/NavBar";
import Router, { routes } from "./Router";
import { AlertProvider } from "./context/Alert/AlertContext";
import GlobalAlert from "./context/Alert/GlobalAlert";

function App() {
  return (
    <>
      <AlertProvider>
        <Router>
          <NavBar navLinks={routes.filter((link) => link.showInNav)} />
          <GlobalAlert />
        </Router>
      </AlertProvider>
    </>
  );
}

export default App;
