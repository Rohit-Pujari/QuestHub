import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  { checkEmailAPI, checkUsernameAPI, registerAPI } from "../../utils/Auth/authAPI";
import Form from "./../../components/Form/Form";
import { useAlert } from "../../context/Alert/AlertContext";

interface field {
  name: string;
  value: string;
  type: string;
  style?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setAlert }= useAlert();
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
      name: "Email",
      value: email,
      type: "email",
      style: "w-full p-2 border border-gray-300 rounded-md",
      onChange: (e) => setEmail(e.target.value),
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
    {
      name: "Confirm Password",
      value: confirmPassword,
      type: "password",
      style: "w-full p-2 border border-gray-300",
      onChange: (e) => setConfirmPassword(e.target.value),
      required: true,
    },
  ];
  const navigate = useNavigate();

  // These lines are related to send the signup or register request to the Auth Service
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setAlert({message: "Passwords do not match", type: "error"});
      return;
    }
    const payload = {
      username: username,
      email: email,
      password: password,
      confirm_password: confirmPassword,
    };
    try {
      const username_check = await checkUsernameAPI({username});
      if (username_check.data.exists) {
        setAlert({message: "Username already exists", type: "info"});
        return;
      }
      const email_check = await checkEmailAPI({email});
      if (email_check.data.exists) {
        setAlert({message: "Email already taken", type: "info"});
        return;
      }
      const response = await registerAPI(payload);
      if (response.status === 201) {
        navigate("/login");
        return;
      } else {
        setAlert({message: "Signup failed", type: "error"});
        return;
      }
    } catch (error) {
      setAlert({message: "Connection Error", type: "error"});
    }
  };
  return (
    <>
      <Form title="Sign Up" fields={fields} onSubmit={onSubmit} submitValue="Sign Up" />
    </>
  );
};

export default Signup;
