import HeaderIcon from "@components/HeaderIcon";
import useAxiosInstance from "@hooks/useAxiosInstance";
import Comment from "@pages/board/Comment";
import createdTime from "@utils/createdTime.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { Fragment, useEffect } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import Spinner from "@components/Spinner";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import ShowConfirmToast from "@components/ShowConfirmToast";

export default function BoardDetailPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  const { _id } = useParams();
  const { user } = useUserStore();
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "게시글",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["posts", _id],
    queryFn: () => axios.get(`/posts/${_id}`),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  if (isLoading) {
    return <Spinner />;
  }

  const deletePost = async () => {
    const confirmed = await ShowConfirmToast("게시글을 삭제하시겠습니까?");
    if (confirmed) {
      const response = await axios.delete(`/posts/${_id}`);
      if (response.status === 200) {
        toast.success("게시글 삭제가 완료되었습니다.");
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
        navigate("/board", { replace: true });
      }
    }
  };

  const newDate = createdTime(data.createdAt);

  return (
    <>
      <Helmet>
        <title>바로파밍 | 바로Farm</title>
      </Helmet>
      <div className="mx-5">
        <div className="flex flex-row mt-5 items-center">
          <img
            src={
              data.user.image
                ? data.user.image.includes("http://") ||
                  data.user.image.includes("https://")
                  ? data.user.image
                  : `https://11.fesp.shop${data.user.image}`
                : "/images/profile/ProfileImage_Sample.jpg"
            }
            alt="ProfileImage"
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="mx-[5px] text-sm">{data.user.name}</span>
          <span className="text-[10px] ml-auto self-start text-gray4">
            {newDate}
          </span>
        </div>
        <div className="mx-[5px] my-[30px]">
          {data.content.split("<br/>").map((line, index) => (
            <Fragment key={index}>
              {line}
              <br />
            </Fragment>
          ))}
        </div>
        {data.image && (
          <img
            className="relative mt-10 mb-1 rounded-md mx-auto"
            src={`https://11.fesp.shop${data.image}`}
          />
        )}
        {data.user._id === user?._id && (
          <div className="text-right text-sm">
            <Link className="underline" to="edit" state={{ data: data }}>
              수정
            </Link>{" "}
            |{" "}
            <button className="underline" onClick={deletePost}>
              삭제
            </button>
          </div>
        )}
        <Comment replies={data.replies} />
      </div>
    </>
  );
}
