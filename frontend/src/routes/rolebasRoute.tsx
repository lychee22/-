
import { Navigate, useLocation } from 'react-router-dom';
import { useUserInfo } from '../context/useAuth';

const RoleBasedRoute = ({ element, allowedRoles }: any) => {
    const { userInfo } = useUserInfo();
    const userRole = userInfo ? userInfo.user.userRole : null
    const location = useLocation();

    if (!userInfo) {
        // 未登录，重定向到登录页面，并记录当前路径
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (userRole && !allowedRoles.includes(userRole)) {
        // 用户角色不在允许的角色列表中，可重定向到无权限页面或首页
        return <Navigate to="/" replace />;
    }

    return element;
};

export default RoleBasedRoute;