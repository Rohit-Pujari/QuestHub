"use client";
import { loginAPI } from "@/api/auth/authAPI";
import Form from "@/components/Form";
import { useAlert } from "@/context/AlertContext";
import { login } from "@/lib/features/Auth/authSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const Login: React.FC = () => {
    const fields = [
        {name: "username", label: "Username", type: "username", required: true},
        {name: "password", label: "Password", type: "password", required: true},
    ];

    const { setAlert } = useAlert();
    const router = useRouter();
    const dispatch = useDispatch();

    const handleFormSubmit = async (formData: FormData) => {
        const data: { [key: string]: string } = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        try {
            const response = await loginAPI(data.username, data.password);
            if (response.status === 200) {
                const { username, token }: { username: string, token: string } = response.data;
                const storeState = {
                    user: {
                        username: username,
                    },
                    token: token,
                    isAuthenticated: true
                };
                // Convert the storeState object to a JSON string before storing
                localStorage.setItem("Auth", JSON.stringify(storeState));
                router.push("/home"); // Redirect to a protected route after login
                dispatch(login(storeState));
                return;
            } else {
                setAlert({ type: "error", message: "Invalid credentials" });
            }
        } catch (error) {
            setAlert({ type: "error", message: "An error occurred" });
        }
    };

    return (
        <div className="flex justify-center">
            <Form title="Login" fields={fields} onSubmit={handleFormSubmit} />
        </div>
    );
};

export default Login;
