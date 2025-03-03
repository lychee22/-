import { Layout } from "antd";
import NewsWrap from "../home/components/NewsWrap";


export default function SearchPage() {
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Layout style={{ height: '100%' }}>
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '100%', display: 'flex', margin: '0px 30px' }}
                    >
                        {/* <Header style={{ background: '#fff', display: 'flex', alignItems: 'center' }}>
                            <Input.Search></Input.Search>
                        </Header>
                        <Divider style={{ margin: '0px' }} /> */}
                        <NewsWrap></NewsWrap>
                    </div>
                </div>
            </Layout >
        </div >
    );
}
