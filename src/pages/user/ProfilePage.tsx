import HeaderIcon from "@components/HeaderIcon";
import ShowConfirmToast from "@components/ShowConfirmToast";
import Spinner from "@components/Spinner";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  const axios = useAxiosInstance();
  const url = "https://11.fesp.shop";

  const queryClient = useQueryClient();

  const location = useLocation();
  const id = location.state.id;

  /// store에서 user 상태를 초기화하는 함수 가져오기
  const resetUser = useUserStore((store) => store.resetUser);

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "프로필 상세",
    });
  }, []);

  // 이미지 파일 유효성 검사
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

  const addProfileImg = useMutation({
    mutationFn: async (item) => {
      let imageUrl = null;

      // 이미지 파일 확인 절차
      if (checkImg(item.image[0])) {
        throw new Error(
          "유효하지 않은 파일입니다. 이미지 파일을 업로드 해주십시오.\n\n유효한 파일: jpeg, jpg, png, gif, webp, svm"
        );
      }
      // 이미지 첨부는 필수이므로 이미지 첨부가 되어있지 않다면 아예 생성되지 않음
      if (item.image && item.image[0]) {
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
          image: imageUrl,
        };
        return axios.patch(`/users/${id}`, body);
      }
    },
    onSuccess: () => {
      toast.success("프로필 이미지 설정 성공!");
      toast.success("설정 적용을 위해 로그아웃합니다. 다시 로그인해주세요.");
      resetUser();
      queryClient.clear();
      navigate("/users/login", { replace: true });
    },
    onError: (error) => {
      toast.error(`에러: ${error.message}`);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addProfileImg.mutate({ image: [file] });
  };

  const setProfileImg = async () => {
    const isConfirmed = await ShowConfirmToast(
      "프로필 이미지를 변경하시겠습니까?"
    );
    if (isConfirmed) document.getElementById("profileImgChange").click();
  };

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => axios.get(`/users/${id}`),
    select: (res) => res.data.item,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>프로필 상세 | 바로Farm</title>
      </Helmet>
      <div className="pt-[60px] mb-[70px]">
        <div className="w-fit mx-auto text-center relative">
          <img
            id="profileImg"
            src={
              userData?.image
                ? userData.image.includes("http://") ||
                  userData.image.includes("https://")
                  ? userData.image
                  : url + userData.image
                : "/images/profile/ProfileImage_Sample.jpg"
            }
            alt="Profile Image"
            className="w-[100px] h-[100px] rounded-full object-cover"
          />
          <button
            className="absolute right-0 -bottom-2"
            onClick={setProfileImg}
          >
            <img
              src="/icons/icon_camera.svg"
              alt="이미지 수정 아이콘"
              className="w-7 h-7"
            />
          </button>
          <input
            id="profileImgChange"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div className="mt-[25px] mb-[30px] mx-auto max-w-fit text-2xl font-bold">
          {userData?.name ? userData.name : "닉네임 없음"}
        </div>
        <div className="flex flex-row gap-5 bg-gray1 mx-5 px-4 py-4 font-medium rounded-md relative">
          <section className="min-w-[65px] break-keep leading-8">
            이름 <br />
            성별 <br />
            이메일 <br />
            전화번호 <br />
            생년월일 <br />
            주소
          </section>

          <section className="text-gray5 break-keep leading-8">
            {userData?.extra?.userName ? (
              userData.extra.userName
            ) : (
              <span className="text-gray3 font-light">이름을 입력해주세요</span>
            )}
            <br />
            {userData?.extra?.gender ? (
              userData.extra.gender === "male" ? (
                "남성"
              ) : (
                "여성"
              )
            ) : (
              <span className="text-gray3 font-light">성별을 선택해주세요</span>
            )}
            <br />
            {userData?.email ? userData.email : "카카오 회원"}
            <br />
            {userData?.phone ? (
              userData.phone
            ) : (
              <span className="text-gray3 font-light">
                전화번호를 등록해주세요
              </span>
            )}{" "}
            <br />
            {userData?.extra?.birth ? (
              userData.extra.birth
            ) : (
              <span className="text-gray3 font-light">생일을 등록해주세요</span>
            )}
            <br />
            {userData?.address ? (
              userData.address.trim("") === "" ? (
                <span className="text-gray3 font-light">
                  주소를 입력해주세요
                </span>
              ) : (
                userData.address
              )
            ) : (
              <span className="text-gray3 font-light">주소를 입력해주세요</span>
            )}
          </section>
          <Link
            to={"/users/profile/edit"}
            className="flex w-7 h-7 items-center text-[14px] absolute right-2 top-2 group"
            state={{ user: userData }}
          >
            <img
              src="/icons/icon_profileEdit_full.svg"
              className="h-10 ml-auto"
              alt="addProduct icon"
            />
            <div className="absolute rounded-md w-auto box-border text-nowrap -translate-x-8 px-1 bg-btn-primary text-white flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="">수정</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
