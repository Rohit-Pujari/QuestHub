import { useState } from "react";
import Form from "../../components/Form/Form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginAPI } from "../../utils/Auth/authAPI";
import { login } from "../../features/auth/authSlice";
import { useAlert } from "../../context/Alert/AlertContext";

interface field {
  name: string;
  value: string;
  type: string;
  style?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const fields: field[] = [
    {
      name: "Username",
      value: username,
      type: "text",
      style: "w-full p-2 border border-gray-300 rounded-md",
      onChange: (e) => setUsername(e.target.value),
      required: true,
    },
    {
      name: "Password",
      value: password,
      type: "password",
      style: "w-full p-2 border border-gray-300 rounded-md",
      onChange: (e) => setPassword(e.target.value),
      required: true,
    },
  ];

  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      username: username,
      password: password,
    };
    try {
      const response = await loginAPI(payload);
      if (response.status === 200) {
        const data = response.data;
        dispatch(login({"user":{"username":data.username},"token":data.access_token}));
        navigate("/");
      } else {
        setAlert({ message: "Invalid Credentials", type: "error" });
      }
    } catch (error) {
      setAlert({ message: "Connection Error", type: "error" });
      console.log(error);
    }
  };

  return (
    <>
      <Form
        title="Login"
        fields={fields}
        onSubmit={handleSubmit}
        submitValue="Login"
      />
    </>
  );
};

export default Login;
