import { Button, Image, Input, List, Menu, message, Pagination, Tag } from "antd";
import './index.scss';
import { useNavigate } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import api from "../../../../utils/request";
import { useArticleContext } from "../../../../context/ArticleContext";
import { debounce } from 'lodash';
import { Header } from "antd/es/layout/layout";
import dayjs from 'dayjs'
import { DislikeOutlined, LikeOutlined, ExportOutlined } from "@ant-design/icons";

const NewsWrap: FC = () => {
    // 模拟新闻数据
    const navigate = useNavigate();
    const [articleList, setArticleList] = useState([]);
    const [keywords, setKeywords] = useState('');
    const { setSelectedArticle } = useArticleContext()
    const [lastTime, setLastTime] = useState('')
    const getArticleData = async (kw: string) => {
        const getNewsReq = {
            getNewsReq: {
                keywords: [kw],
                lastArticleTime: lastTime
            }
        };
        const response = await api.post<any>('/view', getNewsReq);
        if (response.error) {
            message.error(response.error.errorDesc);
        } else {
            message.success('获取首页成功');
            setLastTime(response.getNewsRsp.lastArticleTime);
            setArticleList(response.getNewsRsp.articleList);
            // getImage((articleList[2] as any).content)
        }
    };

    const debouncedGetArticleData = debounce(getArticleData, 500);

    useEffect(() => {
        debouncedGetArticleData(keywords);
        return () => {
            debouncedGetArticleData.cancel();
        };
    }, [keywords]);

    useEffect(() => {
        // 初始加载
        // getArticleData('');
    }, []);

    const jumpToDetail = (item: any) => {
        console.log(item);
        setSelectedArticle(item);
        navigate('/detail');
    };

    // const getImage = (content: string) => {
    //     console.log('-----its content----')
    //     console.log(content)
    //     const result = Base64.decode(content);
    //     console.log(result)
    // }

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = articleList?.slice(startIndex, endIndex);
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const MenuHeader = () => {
        const items = [
            {
                label: '全部',
                key: 'all'
            }, {
                label: '时政',
                key: ''
            },
        ]
        return (<Menu className="menu-header" mode="horizontal" items={items}></Menu>)
    }

    return (
        <div className="news-wrap">
            {/* 中间新闻列表展示区 */}
            <div className="news-list-container">
                <Header className="news-header">
                    <MenuHeader ></MenuHeader>
                </Header>
                <h1 className="search-title">
                    <div className="search-input-wrapper">
                        <Input.Search value={keywords} onChange={(e) => setKeywords(e.target.value)}></Input.Search>
                    </div>
                </h1>

                <div className="article-list-wrapper">
                    <List
                        className="article-list"
                        dataSource={paginatedArticles}
                        renderItem={(item: any) => (
                            <List.Item className="article-item" key={item.article_id} onClick={() => { jumpToDetail(item) }}>
                                <div className="article-content">
                                    <section className="title">{item.title}</section>
                                    <section className="digest">{item.digest}</section>
                                    <section className="time">{item.updateTime ? `更新于：${dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}` : `发布于：${dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')}`}</section>
                                    <section>
                                        {item.labels?.map((item: string) => {
                                            const t = item.slice(1, -1);
                                            return <Tag>{t}</Tag>;
                                        })}
                                    </section>
                                    <div className="article-actions">
                                        <Button size="small" icon={<DislikeOutlined />}></Button>
                                        <Button size="small" icon={<LikeOutlined />}></Button>
                                        <Button size="small" icon={<ExportOutlined />}></Button>
                                    </div>
                                </div>
                                <div className="article-image">
                                    <Image height={150} width={200}
                                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    ></Image>
                                </div>
                            </List.Item>
                        )}
                    />
                    <Pagination
                        className="pagination"
                        current={currentPage}
                        pageSize={pageSize}
                        total={articleList?.length || 0}
                        onChange={handlePageChange}
                    />
                </div>
            </div>

        </div >
    );
};

export default NewsWrap;