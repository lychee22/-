import { Button, Divider, Layout, List, Menu, Pagination } from "antd";
import Sider from "antd/es/layout/Sider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../utils/request";
import { useArticleContext } from "../../../../context/ArticleContext";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

export default function CenterPage() {
    const [allArticles, setAllArticles] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('全部');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const { setSelectedArticle } = useArticleContext()
    const navigate = useNavigate();

    const handleMenuClick = (e: any) => {
        setSelectedStatus(e.key);
        setCurrentPage(1); // 切换状态时重置页码
    };

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    // 进入页面请求文章接口
    useEffect(() => {
        const getPostedArticleReq = {
            getPostedArticleReq: {
                timeInterval: {}
            }
        }
        const fetchArticles = async () => {
            try {
                const response = await api.post<any>('/edit', getPostedArticleReq);
                setAllArticles(response.getPostedArticleRsp?.articleList);
            } catch (error) {
                console.error('获取文章数据失败:', error);
            }
        };
        fetchArticles();
    }, []);

    const filteredArticles = selectedStatus === '全部'
        ? allArticles
        : allArticles?.filter((article: any) => article.status === selectedStatus);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles?.slice(startIndex, endIndex);

    const handleEdit = (item: any) => {
        setSelectedArticle(item)
        navigate('/create/edit')
    }
    const handleDetail = (item: any) => {
        setSelectedArticle(item)
        navigate('/create/detail')
    }
    const handlePublish = () => {
        setSelectedArticle(null)
        navigate('/create/publish')
    }
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <Layout style={{ height: '100%' }}>
                <Sider width={200} style={{ background: '#fff', height: '100%' }}>
                    <Button type="primary" style={{ width: '100%', height: '40px', marginTop: '10px' }} onClick={handlePublish}>
                        新增文章
                    </Button>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedStatus]}
                        onClick={handleMenuClick}
                        style={{ borderRight: 0 }}
                    >
                        <Menu.Item key="全部">全部</Menu.Item>
                        <Menu.Item key="draft">草稿箱</Menu.Item>
                        <Menu.Item key="posted">审核中</Menu.Item>
                        <Menu.Item key="published">已发布</Menu.Item>
                        <Menu.Item key="archived">archived</Menu.Item>
                    </Menu>
                </Sider>
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            margin: '30px 50px ',
                            marginBottom: '0px',
                            background: '#fff',
                            minHeight: 280,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1',
                        }}
                    >
                        <h1>文章列表</h1>
                        <Divider style={{ margin: '0px' }} />
                        <List
                            dataSource={paginatedArticles}
                            style={{ overflow: 'scroll', padding: '0px 20px', height: '100%' }}
                            renderItem={(item: any) => (
                                <List.Item key={item.article_id} style={{ minHeight: '50px', width: '100%', }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                        <section className="title">{item.title}</section>
                                        <section className="digest">{item.digest}</section>
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button size="small" color="primary" onClick={() => handleDetail(item)} icon={<MoreOutlined />}>{/*'详情'*/}</Button>
                                        <Button size="small" color="yellow" onClick={() => handleEdit(item)} icon={<EditOutlined />}></Button>
                                        <Button size="small" color="danger" icon={<DeleteOutlined />}></Button>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredArticles?.length || 0}
                            onChange={handlePageChange}
                            style={{ textAlign: 'center', alignSelf: 'center' }}
                        />
                    </div>

                </div>

            </Layout>
        </div>
    );
}