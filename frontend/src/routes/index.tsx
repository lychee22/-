import React, { FC, Suspense } from "react";
import { RouteObject, useRoutes } from 'react-router-dom';
import RoleBasedRoute from "./rolebasRoute";
import AuditPage from "../pages/audit";
// import DetailPage from "../components/detail/index";
import SearchPage from "../pages/search";
import CreateDetailPage from "../pages/create/components/detail";
import ArticleDetailPage from "../pages/home/components/Detail/index";
// import HomePage from "../pages/home";
// import LoginPage from '../pages/account/index'
// import CreateCenterPage from "../pages/create";

// 懒加载
const HomePage = React.lazy(() => import("../pages/home"));
const LoginPage = React.lazy(() => import('../pages/account/index'));
const CreateCenterPage = React.lazy(() => import("../pages/create"));
const NewsWrap = React.lazy(() => import("../pages/home/components/NewsWrap"));
// const DetailPage = React.lazy(() => import("../pages/detail"));
const PublishPage = React.lazy(() => import("../pages/create/components/publishNews"));
const CenterPage = React.lazy(() => import("../pages/create/components/center"));

export const router: RouteObject[] = [
    {
        path: '/',
        element: <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
        </Suspense>,
        children: [
            {
                index: true,
                element: <NewsWrap></NewsWrap>
            }, {
                path: 'detail',
                element: <Suspense fallback={<div>Loading...</div>}>
                    <ArticleDetailPage></ArticleDetailPage>
                </Suspense>
            }
        ]
    },
    {
        path: '/create',
        element: <RoleBasedRoute
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <CreateCenterPage />
                </Suspense>
            }
            allowedRoles={['auditor', 'editor']}
        />,
        children: [
            {
                index: true,
                element: <CenterPage></CenterPage>
            },
            {
                path: 'publish',
                element: <PublishPage></PublishPage>
            },
            {
                path: 'edit',
                element: <PublishPage></PublishPage>
            }, {
                path: 'detail',
                element: <CreateDetailPage></CreateDetailPage>
            }
        ]
    },
    {
        path: '/detail',
        element: <Suspense fallback={<div>Loading...</div>}>
            <ArticleDetailPage></ArticleDetailPage>
        </Suspense>
    },
    {
        path: '/audit',
        element: <RoleBasedRoute
            element={
                <Suspense fallback={<div>Loading...</div>}>
                    <AuditPage />
                </Suspense>
            }
            allowedRoles={['auditor']}
        />
    },
    {
        path: '/search',
        element: <SearchPage></SearchPage>
    },
    {
        path: '/login',
        element: <Suspense fallback={<div>Loading...</div>}>
            <LoginPage></LoginPage>
        </Suspense>
    }
]
// const RenderRouter =
// (<RouterProvider router={router}></RouterProvider>)
const RenderRouter: FC = () => {
    const element = useRoutes(router);
    return element;
};

export default RenderRouter;