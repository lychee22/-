import { useState } from 'react';
import { Input, Button, List, Avatar, Space } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';

// 评论组件
const CommentComponent = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            author: '张三',
            content: '这篇文章写得很不错！',
            likes: 10,
            dislikes: 2,
            replies: [
                {
                    id: 11,
                    author: '李四',
                    content: '同意，很有深度。',
                    likes: 5,
                    dislikes: 0
                }
            ],
        }, {
            id: 11,
            author: '李四',
            content: '同意，很有深度。',
            likes: 5,
            dislikes: 0
        }
    ]);
    const [newComment, setNewComment] = useState('');

    // 处理评论输入变化
    const handleCommentChange = (e: any) => {
        setNewComment(e.target.value);
    };

    // 提交新评论
    const handleSubmitComment = () => {
        if (newComment.trim()) {
            const newCommentObj = {
                id: comments.length + 1,
                author: '你',
                content: newComment,
                likes: 0,
                dislikes: 0,
                replies: []
            };
            setComments([...comments, newCommentObj]);
            setNewComment('');
        }
    };

    // 点赞评论
    const handleLikeComment = (commentId: any) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, likes: comment.likes + 1 };
                }
                if (comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies?.map((reply) => {
                            if (reply.id === commentId) {
                                return { ...reply, likes: reply.likes + 1 };
                            }
                            return reply;
                        })
                    };
                }
                return comment;
            })
        );
    };

    // 点踩评论
    const handleDislikeComment = (commentId: any) => {
        setComments(
            comments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, dislikes: comment.dislikes + 1 };
                }
                if (comment.replies) {
                    return {
                        ...comment,
                        replies: comment.replies.map((reply) => {
                            if (reply.id === commentId) {
                                return { ...reply, dislikes: reply.dislikes + 1 };
                            }
                            return reply;
                        })
                    };
                }
                return comment;
            })
        );
    };

    // 渲染评论列表
    const renderCommentList = (commentList: any) => {
        return (
            <List
                style={{ background: '#fff', marginTop: '20px', padding: '0px 15px' }}
                dataSource={commentList}
                renderItem={(comment: any) => (
                    <List.Item className='comment-wrap' style={{ textAlign: 'left', }}>
                        <Space direction="vertical" size="small" >
                            <Space style={{ height: '58px' }}>
                                <Avatar>{comment.author[0]}</Avatar>
                                <div>
                                    <p>{comment.author}</p>
                                    <p>{comment.content}</p>
                                </div>
                            </Space>
                            <Space>
                                <Button type="link" onClick={() => handleLikeComment(comment.id)}>
                                    <LikeOutlined /> {comment.likes}
                                </Button>
                                <Button type="link" onClick={() => handleDislikeComment(comment.id)}>
                                    <DislikeOutlined /> {comment.dislikes}
                                </Button>
                            </Space>
                            {comment.replies?.length > 0 && (
                                <div style={{ marginLeft: 32 }}>
                                    {renderCommentList(comment.replies)}
                                </div>
                            )}
                        </Space>
                    </List.Item>
                )}
            />
        );
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <Input.TextArea
                value={newComment}
                onChange={handleCommentChange}
                placeholder="发表你的评论..."
                rows={4}
            />
            <Button type="primary" onClick={handleSubmitComment}>
                提交评论
            </Button>
            {renderCommentList(comments)}
        </div>
    );
};

export default CommentComponent;