// app/recruit/minister/detail/[id]/page.tsx
import axios from 'axios';
import MainURL from '../../../../../MainURL';
import NoticeDetail from './Detail';

interface Props {
  params: {
    sort: string;
    id: string;
  };
}

export default async function Page({ params }: Props) {
  const ID = params.id;
  const SORT = params.sort;

  let postData = null;
  let commentsList = [];
  let isLiked = null;

  try {
    const resPost = await axios.get(`${MainURL}/api/noticeboard/getnoticepost/${ID}`)
    const copyPost = Array.isArray(resPost.data) ? resPost.data : [];
    postData = copyPost[0];
    const resComment = await axios.get(`${MainURL}/api/noticeboard/getallnoticecomments/${ID}`)
    const copy = Array.isArray(resComment.data) ? resComment.data : [];
    commentsList = copy;
    const resIsliked = await axios.get(`${MainURL}/api/noticeboard/getnoticeisliked/${ID}`)
    const copyIsliked = Array.isArray(resIsliked.data) ? resIsliked.data : [];
    isLiked = copyIsliked;
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }

  return (
    <NoticeDetail postDataProps={postData} commentsListProps={commentsList} isLikedProps={isLiked} />
  );
}
