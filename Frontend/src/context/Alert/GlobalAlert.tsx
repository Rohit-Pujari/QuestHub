import Alert from "../../components/Alert/Alert";
import { useAlert } from "./AlertContext";

const GlobalAlert: React.FC = () => {
    const {alert,setAlert} = useAlert();
    return (
        alert && (
            <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
            />
        )
    )
}

export default GlobalAlert;