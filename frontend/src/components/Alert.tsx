import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from "@fortawesome/free-solid-svg-icons";
interface AlertProps {
    message: string;
    type: "success" | "error" | "info";
    onClose: () => void;
}
const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const alertStyles = {
        success: "bg-green-100 border-green-500 text-green-700",
        error: "bg-red-100 border-red-500 text-red-700",
        info: "bg-blue-100 border-blue-500 text-blue-700",
    };
    return (
        <div
            className={`m- border-l-4 p-4 mb-4 ${alertStyles[type]} rounded-md flex justify-between items-center`}
        >
            <span>{message}</span>
            <button type="button" onClick={onClose} className="ml-4 text-gray-600 hover:text-gray-800">
                <FontAwesomeIcon icon={faRectangleXmark} size="xl" />
            </button>
        </div>
    )
}

export default Alert;