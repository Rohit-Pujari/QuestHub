"use client";
import { loginAPI } from "@/api/auth/authAPI";
import Form from "@/components/Form";
import { login } from "@/lib/features/Auth/authSlice";
import { access } from "fs";
const Login: React.FC = () => {
    const fields = [
        {name: "username", label: "Username", type: "username", required: true},
        {name: "password", label: "Password", type: "password", required: true},
    ]
    const handleFormSubmit = async(formData: FormData) => {
        const data: { [key: string]: string } = {};
        formData.forEach((value, key) => {
          data[key] = value.toString();
        });
        try{
          const response = await loginAPI(data.username, data.password);
          const store = {
            user:{
              username: response.username,
            },
            token:response.access_token,
            isAuthenticated:true
          }
          localStorage.setItem("Auth", JSON.stringify(store));
          login(response);
        }catch(error){
          console.log(error)
      };
    }
    return(
        <div className="flex justify-center">
        <Form title="Login" fields={fields} onSubmit={handleFormSubmit}>
        </Form>
        </div>
    )
}
export default Login;