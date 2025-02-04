import HeaderIcon from "@components/HeaderIcon";
import NewPost from "@components/NewPost";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

export default function BoardNewPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const isBoard = true;
  const queryClient = useQueryClient();

  const axios = useAxiosInstance();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "새 글 작성",
    });
  }, []);

  //업로드되는 파일은 이미지 파일로 제한
  const checkImg = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg",
    ]; // 허용 MIME 타입
    if (!validTypes.includes(file.type)) {
      return true;
    }
    return false;
  };

  const addItem = useMutation({
    mutationFn: async (item) => {
      let imageUrl = null;

      if (!item.content) {
        throw new Error("본문 내용은 필수로 입력해야 합니다");
      }

      if (item.image && item.image[0]) {
        // 없로드되는 파일은 이미지로 제한
        if (checkImg(item.image[0])) {
          throw new Error(
            "jpeg, jpg, png, gif, webp, svg 파일을 업로드해야 합니다."
          );
        }
        const formData = new FormData();
        formData.append("attach", item.image[0]);
        try {
          const uploadImg = await axios.post(`/files`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageUrl = uploadImg.data.item[0].path; // 서버에서 반환된 이미지 URL
        } catch (error) {
          console.error(
            "Image upload failed:",
            error.response?.data || error.message
          );
          throw new Error("Image upload failed.");
        }

        const body = {
          content: item.content.replace(/\n|\r\n/g, "<br/>"),
          type: "community",
          image: imageUrl,
        };
        return axios.post(`/posts`, body);
      } else {
        const body = {
          content: item.content,
          type: "noPic",
        };
        return axios.post(`/posts`, body);
      }
    },
    onSuccess: () => {
      toast.success("게시물이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/board`, {
        state: { from: window.location.pathname },
        replace: true,
      });
    },
    onError: (err) => {
      console.error(err);
      const errorMessage = err.response
        ? err.response.data.errors[0].msg
        : err.message.replace(/^Error:\s*/, "");

      toast.error(errorMessage);
    },
  });

  return (
    <>
      <Helmet>
        <title>게시글 작성 | 바로Farm</title>
      </Helmet>
      <NewPost
        isBoard={isBoard}
        handleSubmit={handleSubmit(addItem.mutate)}
        register={register}
        errors={errors}
      ></NewPost>
    </>
  );
}
