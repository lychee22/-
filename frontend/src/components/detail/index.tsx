import { useState, useEffect, useRef } from 'react';
import { Button, Descriptions, DescriptionsProps, Tag } from "antd";
// import '../publishNews/styles.scss';
import '../../App.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useArticleContext } from '../../context/ArticleContext';
import { Header } from 'antd/es/layout/layout';
import { Base64 } from 'js-base64';
import DetailEditor from './detail';

export default function DetailPage() {
    const [articleContent, setArticleContent] = useState({});
    // const [isLoading, setIsLoading] = useState(false); // 添加加载状态
    const { selectedArticle } = useArticleContext()
    const location = useLocation();
    const editorRef = useRef(null)
    const navigate = useNavigate()

    const [detailItems, setDetailItems] = useState(null as any)

    // 加载草稿数据
    useEffect(() => {

        // 如果是点击编辑进入，则填充
        if (location.pathname.includes('/detail') && selectedArticle) {
            const { title, content, digest, labels } = selectedArticle
            const binaryString = Base64.decode(content)
            setArticleContent(binaryString)
            console.log('---detail---', selectedArticle)
            const tags = labels?.map((item: string) => item.slice(1, -1));

            const items: DescriptionsProps['items'] = [
                {
                    key: 1,
                    label: '文章标题',
                    children: title
                }, {
                    key: 2,
                    label: '文章摘要',
                    children: digest
                }, {
                    key: 3,
                    label: '文章标签',
                    children: tags?.map((item: string) => {
                        return <Tag>{item}</Tag>
                    })
                }
            ]
            setDetailItems(items)
        }
    }, []);


    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', background: '#fff', }}>
            <Header style={{ backgroundColor: '#fff', height: '40px', textAlign: 'left', display: 'flex', alignItems: 'center', padding: '0px 10px' }}>
                <Button size='small' type='text' onClick={() => navigate(-1)}>返回上级</Button>
            </Header>
            <div style={{ flex: '1', padding: '0px 30px', overflow: 'scroll', height: '100%', }}>
                <Descriptions column={1} items={detailItems} />
                <DetailEditor ref={editorRef} editContent={articleContent}></DetailEditor>
            </div>
        </div>
    );
}
