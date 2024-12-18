import { useSelector } from "react-redux";
import { Navigate, Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { checklogin } from "./authSlice";

const ProtectedRoute = () => {
    const dispatch = useDispatch();
    dispatch(checklogin());
    let token = useSelector(state => state.auth.token);
    let user = useSelector(state => state.auth.user);
    if (!token) return <Navigate to="/login" />
    else if (user.role !== 1) return <Navigate to="/login" />
    else return (<Outlet/>);   // ok cho qua
};
export default ProtectedRoute;