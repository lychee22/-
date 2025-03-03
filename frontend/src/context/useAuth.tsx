import axios from "axios";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

// 创建 AuthContext 用于管理 Token
const AuthContext = createContext<{ token: string | null; setToken: (newToken: string | null) => void }>({ token: null, setToken: () => { } });

// 创建 UserInfoContext 用于管理用户信息
const UserInfoContext = createContext<{ userInfo: any | null; setUserInfo: (newUserInfo: any | null) => void }>({ userInfo: null, setUserInfo: () => { } });

// 全局变量用于存储 token
let globalToken: string | null = null;

// 定义更新全局 token 的函数
const setGlobalToken = (newToken: string | null) => {
    globalToken = newToken;
    if (newToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        localStorage.setItem('token', newToken);
    } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('token');
    }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));
    const [userInfo, setUserInfo_] = useState<any | null>(JSON.parse(localStorage.getItem("userInfo") || "null"));

    useEffect(() => {
        setGlobalToken(token);
    }, [token]);

    const authContextValue = useMemo(
        () => ({
            token,
            setToken: setToken_,
        }),
        [token]
    );

    const userInfoContextValue = useMemo(
        () => ({
            userInfo,
            setUserInfo: setUserInfo_,
        }),
        [userInfo]
    );

    return (
        <AuthContext.Provider value={authContextValue}>
            <UserInfoContext.Provider value={userInfoContextValue}>
                {children}
            </UserInfoContext.Provider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const useUserInfo = () => {
    return useContext(UserInfoContext);
};

// 导出全局 token 和设置 token 的函数
export { globalToken, setGlobalToken };

export default AuthProvider;