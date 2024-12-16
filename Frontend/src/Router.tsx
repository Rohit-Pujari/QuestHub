import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import Loading from "./components/Loading/Loading";

export interface Route{
    name: string;
    path: string;
    element:React.FC;
    showInNav: boolean;
}

export const routes: Route[] = [
    { name: "Home", path: "/", element: React.lazy(() => import("./pages/Home/Home")), showInNav: true},
    { name: "About", path: "/about", element: React.lazy(() => import("./pages/About/About")), showInNav: true},
    { name: "Features", path: "/features", element: React.lazy(() => import("./pages/Features/Features")), showInNav: true},
    { name: "Contact", path: "/contact", element: React.lazy(() => import("./pages/Contact/Contact")), showInNav: true},
    { name: "login", path: "/login", element: React.lazy(() => import("./pages/Login/Login")), showInNav: false},
    { name: "signup", path: "/sign-up", element: React.lazy(() => import("./pages/Signup/Signup")), showInNav: false},
];



const Router:React.FC<{children:React.ReactNode}>= ({children}) => {
    return (
        <BrowserRouter>
        {children}
        <Suspense fallback={<Loading/>}>
        <Routes>
        {routes.map(route => (
            <Route key={route.path} path={route.path} element={<route.element />}/>
        ))}
        </Routes>
        </Suspense>
        </BrowserRouter>
    );
}

export default Router;