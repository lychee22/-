import DetailPage from "../../../../components/detail/index";
// import { useState } from 'react';
import CommentComponent from './components/comment';

const ArticleDetailPage = () => {
    // const [comments, setComments] = useState<any>([]);
    // const [likes, setLikes] = useState(0);

    // const handleCommentSubmit = (comment: any) => {
    //     setComments([...comments, comment]);
    // };

    // const handleLike = () => {
    //     setLikes(likes + 1);
    // };

    // const handleShare = () => {
    //     // 这里可以添加分享逻辑，例如弹出分享框等
    //     console.log('分享操作');
    // };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', margin: '30px' }}>
            <DetailPage></DetailPage>
            <CommentComponent />
        </div>
    );
};

export default ArticleDetailPage;