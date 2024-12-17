import NavBar from "./components/NavBar/NavBar";
import Router from "./Router";
import { AlertProvider } from "./context/Alert/AlertContext";
import GlobalAlert from "./context/Alert/GlobalAlert";

function App() {
  return (
    <>
      <AlertProvider>
        <Router>
          <NavBar />
          <GlobalAlert />
        </Router>
      </AlertProvider>
    </>
  );
}

export default App;
