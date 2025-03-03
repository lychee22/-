import { Button, Layout } from 'antd';
import { Outlet } from 'react-router-dom';
const { Sider } = Layout;


export default function HomePage() {

    return (
        <div className='homeWrap' style={{ height: '100%', width: '100%', display: 'flex', gap: '50px' }}>
            {/* 侧边栏导航 */}
            <Sider width={200} style={{ background: '#fff', height: '100%', display: 'flex' }}>
                <Button></Button>
            </Sider>
            {/* <div style={{ width: '300px', height: '100%', background: '#fff' }}>

            </div> */}
            <Outlet />

        </div>
    );
}
