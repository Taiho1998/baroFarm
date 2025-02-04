import Button from "@components/Button";
import ShowConfirmToast from "@components/ShowConfirmToast";
import useAxiosInstance from "@hooks/useAxiosInstance";
import CommentItem from "@pages/board/CommentItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

Comment.propTypes = {
  replies: PropTypes.array,
};

export default function Comment({ replies = [] }) {
  const { _id } = useParams();
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();

  const repliesList = replies.map((item) => (
    <CommentItem key={item._id} item={item}></CommentItem>
  ));

  const addComment = useMutation({
    mutationFn: async (item) => {
      if (user) return axios.post(`/posts/${_id}/replies`, item);
      else throw Error();
    },
    onSuccess: () => {
      reset();
      toast.success("댓글이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["posts", _id] });
    },
    onError: async (err) => {
      console.error(err);
      const isConfirmed = await ShowConfirmToast(
        "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
      );
      if (!user && isConfirmed) {
        navigate("/users/login");
      }
    },
  });

  return (
    <>
      <section className="pt-5">
        <span className="font-semibold">댓글 ({replies.length})</span>
        {replies.length === 0 && (
          <div className="min-h-[85px] flex justify-center items-center border-b-[1px] border-gray3/50 text-gray4 break-keep text-center text-sm py-[30px]">
            아직 댓글이 없습니다!
            <br />
            <br /> 댓글은 작성자에게 큰 힘이 됩니다.
            <br /> 지금 바로 첫 댓글의 주인공이 되어보세요!
          </div>
        )}
        {replies.length !== 0 && repliesList}
      </section>
      <form
        className="h-[65px] flex px-5 -mx-5 items-center"
        onSubmit={handleSubmit(addComment.mutate)}
      >
        <input
          type="text"
          id="comment"
          name="comment"
          className="text-sm border border-gray3 max-w-[285px] h-[30px] rounded-md px-[5px] mr-5 flex-grow placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
          placeholder="댓글을 입력해주세요"
          {...register("content")}
        />
        <div>
          <Button type="submit">등록</Button>
        </div>
      </form>
    </>
  );
}
