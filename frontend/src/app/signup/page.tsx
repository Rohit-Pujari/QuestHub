"use client";

import { useRouter } from "next/navigation";
import { checkEmailAPI, checkUsernameAPI, registerAPI } from "@/api/auth/authAPI";
import Form from "@/components/Form";
import { useAlert } from "@/context/AlertContext";

const Signup: React.FC = () => {
    const fields = [
        { name: "username", label: "Username", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "password", label: "Password", type: "password", required: true },
        { name: "confirmPassword", label: "Confirm Password", type: "password", required: true }
    ];
    const router = useRouter();
    const { setAlert } = useAlert();

    const handleFormSubmit = async (formData: FormData) => {
        const data: { [key: string]: string } = {};
        // this regex is used to check if the password is strong enough
        let condition = false;
        const passwordCheck = /^(?=.*\b(password|123456|123456789|12345|1234|qwerty|abc123|password1|letmein|welcome|admin|sunshine|iloveyou|princess|123123|qwerty123|1q2w3e4r5t|qwertyuiop)\b).{6,}$/
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });
        const payload = {
            "username": data.username,
            "email": data.email,
            "password": data.password,
            "confirm_password": data.confirmPassword
        };
        if (payload.password !== payload.confirm_password) {
            setAlert({ type: "info", message: "Passwords do not match" });
            return;
        }
        if(payload.password.length < 8){
            setAlert({ type: "info", message: "Password must be at least 8 characters" });
            return
        }
        if(passwordCheck.test(payload.password)){
            setAlert({ type: "info", message: "Use a Strong Password" });
            return
        }
        condition = true;
        if (condition) {
            try {
                const checkUsername = await checkUsernameAPI(payload.username);
                if (checkUsername.data.exists) {
                    setAlert({ type: "info", message: "Username already exists" });
                    return;
                }
                const checkEmail = await checkEmailAPI(payload.email);
                if (checkEmail.data.exists) {
                    setAlert({ type: "info", message: "Email already exists" });
                    return;
                }
                const response = await registerAPI(payload.username, payload.email, payload.password, payload.confirm_password);
                if (response.status === 201) {
                    router.push("/login");
                    setAlert({ type: "success", message: "Accound Registered Successfully procced to login" });
                    return;
                } else {
                    setAlert({ type: "error", message: "An error occurred" });
                }
            } catch (error) {
                setAlert({ type: "error", message: "An error occurred" });
            }
        }
    };

    return (
        <div className="flex justify-center">
            <Form title="Signup" fields={fields} onSubmit={handleFormSubmit} />
        </div>
    );
};

export default Signup;
