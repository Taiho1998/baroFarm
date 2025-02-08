import createdTime from "@utils/createdTime";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ShowConfirmToast from "@components/ShowConfirmToast";

CommentItem.propTypes = {
  item: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      _id: PropTypes.number.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    _id: PropTypes.number.isRequired,
  }),
};

export default function CommentItem({ item }) {
  const { user } = useUserStore();
  const axios = useAxiosInstance();
  const { _id } = useParams();
  const queryClient = useQueryClient();

  const deleteComment = async () => {
    const isConfirmed = await ShowConfirmToast("댓글을 삭제하시겠습니까?");
    if (isConfirmed) {
      const response = await axios.delete(`/posts/${_id}/replies/${item._id}`);
      if (response.status === 200) {
        toast.success("댓글 삭제가 완료되었습니다.");
        queryClient.invalidateQueries({ queryKey: ["posts", _id] });
      }
    }
  };

  const newDate = createdTime(item.createdAt);
  return (
    <>
      <div className="flex flex-row mt-5 px-[15px] items-center">
        <img
          src={
            item.user.image
              ? item.user.image.includes("http://") ||
                item.user.image.includes("https://")
                ? item.user.image
                : `https://11.fesp.shop${item.user.image}`
              : "/images/profile/ProfileImage_Sample.jpg"
          }
          alt="ProfileImage"
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="mx-[5px] text-sm">{item.user.name}</span>
        <span className="text-[10px] ml-auto text-gray4 self-start">
          {newDate}
        </span>
      </div>
      <div className="flex pb-5 border-b-[1px] border-gray3/50 px-[15px]">
        <div className="mt-3 text-xs text-gray5 pl-5">{item.content}</div>
        {user?._id === item.user._id && (
          <span className="ml-auto text-xs mt-auto flex-shrink-0">
            <button className="underline" onClick={deleteComment}>
              삭제
            </button>
          </span>
        )}
      </div>
    </>
  );
}
