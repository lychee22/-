import { Menu, message, Popconfirm } from "antd";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUserInfo } from "../../context/useAuth";
import { ItemType } from "antd/es/menu/interface";

const Header: FC<{
    customLeftContent?: React.ReactNode;
    customRightContent?: React.ReactNode;
    customCenterContent?: React.ReactNode;
}> = ({ customLeftContent, customRightContent, customCenterContent }) => {
    const navigate = useNavigate();
    const { setToken } = useAuth();
    const { userInfo, setUserInfo } = useUserInfo();
    const isLogin = userInfo ? "logout" : "login";
    const userRole = userInfo?.user?.userRole;

    const logoutConfirm = () => {
        setToken("");
        setUserInfo(null);
        localStorage.setItem('userId', '')
        localStorage.setItem('md5Hex', '')
        message.success("注销登录成功");
        navigate("/login");
    };

    console.log("=====userRole===", userRole);

    const homeMenuItem: ItemType = {
        label: "首页",
        key: "",
    };

    const createMenuItem = userInfo
        ? {
            label: "创作中心",
            key: "create",
        }
        : null;

    const auditMenuItem =
        userRole && ["auditor"].includes(userRole)
            ? {
                label: "审核中心",
                key: "audit",
            }
            : null;

    const searchMenuItem: ItemType = {
        label: "搜索🔍",
        key: "search",
    };

    const loginLogoutMenuItem: ItemType = {
        label: userInfo ? (
            <Popconfirm
                title="退出登录"
                description="你确定要退出登录吗？"
                okText="确认"
                cancelText="取消"
                onConfirm={logoutConfirm}
            >
                注销
            </Popconfirm>
        ) : "登录",
        key: isLogin,
    };

    const onMenuClick = (e: any) => {
        if (e.key !== "logout" && e.key !== "title") {
            const routePath = e.key === "" ? "/" : `/${e.key}`;
            navigate(routePath);
        }
    };

    return (
        <header style={{ display: "flex", alignItems: "center", height: "50px", background: '#fff', borderBottom: '1px solid #eeeeee' }}>
            {/* 左侧自定义内容 */}
            {customLeftContent}
            <Menu
                style={{ flex: 1, display: "flex", border: '0px' }}
                mode="horizontal"
                onSelect={onMenuClick}
                items={[
                    homeMenuItem,
                    createMenuItem,
                    auditMenuItem,
                    customCenterContent,
                ].filter(Boolean) as ItemType[]}
            />
            {userInfo && <div style={{ background: '#fff' }}>
                欢迎👏 {userInfo.user?.username}
            </div>}
            <Menu
                style={{ display: "flex", border: '0px' }}
                mode="horizontal"
                onSelect={onMenuClick}
                items={[searchMenuItem, loginLogoutMenuItem].filter(
                    Boolean
                ) as ItemType[]}
            />

            {/* 右侧自定义内容 */}
            {customRightContent}
        </header>
    );
};

export default Header;