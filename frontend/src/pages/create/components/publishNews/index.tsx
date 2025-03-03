import { useState, useEffect, useRef } from 'react';
import { Button, Card, message, Select } from "antd";
import { Form } from "antd";
import { Input } from "antd";
import Editor from '../editor';
import './styles.scss';
import '../../../../App.css';
import { useUserInfo } from '../../../../context/useAuth';
import api from '../../../../utils/request';
import { useLocation, useNavigate } from 'react-router-dom';
import { useArticleContext } from '../../../../context/ArticleContext';
import { Header } from 'antd/es/layout/layout';
import { Base64 } from 'js-base64';
const DRAFT_KEY = 'article_draft';

export default function PublishPage() {
    const [articleTitle, setArticleTitle] = useState('');
    const [articleContent, setArticleContent] = useState({});
    const [articleSummary, setArticleSummary] = useState('');
    const [articleTags, setArticleTags] = useState([]);
    const { selectedArticle } = useArticleContext()
    let editContent = ''
    // let defaultContent = editContent ? editContent : ''
    const location = useLocation();
    const isEdit = location.pathname.includes('/edit')
    const { userInfo } = useUserInfo()
    const editorRef = useRef(null)
    const navigate = useNavigate()

    // 加载草稿数据
    useEffect(() => {
        // 如果是点击编辑进入，则填充
        if (location.pathname.includes('/edit') && selectedArticle) {
            const { title, content, digest, labels } = selectedArticle
            const binaryString = Base64.decode(content);;
            setArticleTitle(title);
            setArticleContent(binaryString);
            setArticleSummary(digest);
            setArticleTags(labels?.map((item: string) => item.slice(1, -1)));
        }
        else {
            // const draft = localStorage.getItem(DRAFT_KEY);
            // if (draft) {
            //     const { title, content, summary, category, tags } = JSON.parse(draft);
            //     setArticleTitle(title);
            //     setArticleContent(content);
            //     setArticleSummary(summary);
            //     setArticleCategory(category);
            //     setArticleTags(tags);
            // }
        }
    }, []);

    // 发布文章
    const onConfirm = async (operate: string) => {
        handleGetEditorState()
        // 将编辑器内容转成二进制
        console.log('111', editContent)
        const encoder = new TextEncoder();
        const content = encoder.encode(editContent)

        const decode = new TextDecoder()
        console.log('====解码====', decode.decode(content))
        // 获取当前时间
        const timestamp = new Date;
        const currtime = timestamp.toISOString()
        let messageText = ''

        let articleInfo: any = {
            title: articleTitle,
            content: content,
            author: userInfo.user.userId, // 用户手机号
            labels: articleTags,
            digest: articleSummary,
            // auditor: userInfo.user.userId //审核员
        }

        if (selectedArticle) {
            articleInfo.articleId = selectedArticle.articleId
            articleInfo.createTime = selectedArticle.createTime
            articleInfo.updateTime = currtime
            messageText = '编辑成功'
        }
        if (operate === 'draft') {
            messageText = '已保存为草稿'
            articleInfo = { ...articleInfo, status: 'draft' }
        } else if (operate === 'publish') {
            messageText = selectedArticle ? '编辑成功' : '发布成功'
            articleInfo = { ...articleInfo, status: 'posted' }
        }
        const postArticleReq = {
            postArticleReq: { articleInfo: articleInfo },
            auditorId: userInfo.user.userId  // 可选，审核员id
        }
        console.log('发布文章:', postArticleReq);
        const response = await api.post<any>('/edit', postArticleReq)
        if (response.error) {
            message.error(response.error.errorDesc);
        } else {
            message.success(messageText)
            navigate('/create')
        }
        // 发布成功后清除草稿
    };

    // 接收编辑器内容的回调函数
    const handleEditorContentChange = (content: string) => {
        console.log('----articleContent---', content)
        setArticleContent(content);
        editContent = content
    };

    const handleGetEditorState = () => {
        if (editorRef.current) {
            const editorState = (editorRef.current as any).getEditorState();
            editContent = editorState
            console.log('Received editor state in parent:', editContent);
        }
    }

    // 标签
    const tagOptions = [
        { value: '财经', label: '财经' },
        { value: '体育', label: '体育' },
        { value: '娱乐', label: '娱乐' },
    ]
    const handleTagsChange = (value: any) => {
        setArticleTags(value)
    }
    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ backgroundColor: '#fff', height: '40px', textAlign: 'left', display: 'flex', alignItems: 'center', padding: '0px 10px' }}>
                <Button size='small' type='text' onClick={() => navigate('/create')}>返回上级</Button>
            </Header>
            <div className="createWrap">
                <Card>
                    <Form.Item label='文章标题'>
                        <Input
                            placeholder="请输入文章标题"
                            value={articleTitle}
                            onChange={(e) => setArticleTitle(e.target.value)}
                        />
                    </Form.Item>
                </Card>
                <Card>
                    <Editor ref={editorRef} onContentChange={handleEditorContentChange} editContent={articleContent} onReceiveEditorState={handleEditorContentChange} />
                </Card>
                <Card>
                    <Form.Item label='文章摘要'>
                        <Input
                            rules={}
                            placeholder="请输入文章摘要"
                            value={articleSummary}
                            onChange={(e) => setArticleSummary(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item label='文章标签'>
                        <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            placeholder="请选择标签"
                            onChange={handleTagsChange}
                            value={articleTags}
                            options={tagOptions}
                        />
                    </Form.Item>
                </Card>
                <div>
                    <Button onClick={() => onConfirm('draft')} style={{ marginRight: '10px' }}>保存草稿</Button>
                    <Button onClick={() => onConfirm('publish')}>{isEdit ? '保存编辑' : '发布文章'}</Button>
                </div>
            </div>
        </div>

    );
}
