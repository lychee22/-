import { Button, Descriptions, Divider, Input, Layout, List, message, Modal, Pagination, Popconfirm, Tag } from "antd";
import { useState, useEffect } from "react";
import api from "../../utils/request";
import DetailEditor from "../../components/detail/detail";
import { Base64 } from "js-base64";
import Sider from "antd/es/layout/Sider";

// 定义驳回弹窗组件
const RejectModal = ({ visible, onCancel, onOk, articleId }: any) => {
    const [rejectReason, setRejectReason] = useState('');

    const handleConfirm = async () => {
        const auditArticleReq = {
            auditArticleReq: {
                articleId,
                approved: false,
                reason: rejectReason
            }
        };
        try {
            const response = await api.post<any>('/edit', auditArticleReq);
            if (response.error) {
                message.error(response.error.errorDesc);
            } else {
                message.success('已驳回');
                onOk();
            }
        } catch (error) {
            console.error('驳回文章请求出错:', error);
        }
    };

    return (
        <Modal
            title="驳回理由"
            open={visible}
            okText="确定"
            cancelText="取消"
            onOk={handleConfirm}
            onCancel={() => {
                setRejectReason('');
                onCancel();
            }}
        >
            <div>
                <Input.TextArea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="请输入驳回理由"
                />
            </div>
        </Modal>
    );
};

export default function CenterPage() {
    const [allArticles, setAllArticles] = useState([]);
    const [selectedStatus] = useState('全部');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDate, setModalDate] = useState({} as any);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState('');

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const fetchArticles = async () => {
        const getViewArticleReq = {
            getViewArticleReq: {
                timeInterval: {}
            }
        };
        try {
            const response = await api.post<any>('/edit', getViewArticleReq);
            if (response.error) {
                message.error(response.error.errorDesc);
            }
            setAllArticles(response.getViewArticleRsp?.articleList);
        } catch (error) {
            console.error('获取待审核数据失败:', error);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const filteredArticles = selectedStatus === '全部'
        ? allArticles
        : allArticles?.filter((article: any) => article.status === selectedStatus);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = filteredArticles?.slice(startIndex, endIndex);

    const showModal = (item: any) => {
        item.content = Base64.decode(item.content);
        setModalDate(item);
        setIsModalOpen(true);
    };

    const handleOk = async (item: any) => {
        const auditArticleReq = {
            auditArticleReq: {
                articleId: item.articleId,
                approved: true
            }
        };
        const response = await api.post<any>('/edit', auditArticleReq);
        if (response.error) {
            message.error(response.error.errorDesc);
        } else {
            message.success('审核通过');
            fetchArticles();
        }
        setIsModalOpen(false);
    };

    const handleCancel = (item: any) => {
        setSelectedArticleId(item.articleId);
        setIsRejectModalOpen(true);
    };

    return (
        <div style={{ height: '100%', width: '100%' }}>

            <Layout style={{ height: '100%' }}>
                <Sider style={{ width: '300px', background: '#fff' }}>

                </Sider>
                <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div
                        style={{
                            margin: '30px 50px',
                            marginBottom: '0px',
                            background: '#fff',
                            minHeight: 280,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            flex: '1',
                        }}
                    >
                        <h1>审核列表</h1>
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
                                        <Button onClick={() => showModal(item)}>查看详情</Button>
                                        <Button onClick={() => handleCancel(item)} color="danger" variant="solid">驳回</Button>
                                        <Popconfirm
                                            title="通过"
                                            description="确定要通过该文章吗？"
                                            okText="确认"
                                            cancelText="取消"
                                            onConfirm={() => handleOk(item)}
                                        ><Button color="green">通过</Button></Popconfirm>
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
            </Layout >
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                okText="确定"
                cancelText="取消"
                onCancel={() => setIsModalOpen(false)}
            >
                <Descriptions column={1}>
                    <Descriptions.Item label='文章标题' key={1}>{modalDate.title}</Descriptions.Item>
                    <Descriptions.Item label='文章摘要' key={2}>{modalDate.digest}</Descriptions.Item>
                    <Descriptions.Item label='文章标签' key={3}>{modalDate.labels?.map((item: string) => {
                        const t = item.slice(1, -1);
                        return <Tag>{t}</Tag>;
                    })}</Descriptions.Item>
                </Descriptions>
                <DetailEditor editContent={modalDate.content}></DetailEditor>
            </Modal>
            <RejectModal
                visible={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                onOk={() => {
                    setIsRejectModalOpen(false);
                    fetchArticles();
                }}
                articleId={selectedArticleId}
            />
        </div >
    );
}
