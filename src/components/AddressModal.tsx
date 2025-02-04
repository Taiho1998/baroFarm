import Button from "@components/Button";
import PGButton from "@components/PGButton";
import PostcodeSearch from "@components/PostcodeSearch";
import ShowConfirmToast from "@components/ShowConfirmToast";
import useAxiosInstance from "@hooks/useAxiosInstance";
import PortOne from "@portone/browser-sdk/v2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

AddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  userData: PropTypes.shape({
    address: PropTypes.string,
    extra: PropTypes.shape({
      addressBook: PropTypes.array,
      userName: PropTypes.string,
    }),
    name: PropTypes.string.isRequired,
    _id: PropTypes.number.isRequired,
    phone: PropTypes.string,
  }).isRequired,
  addressId: PropTypes.number.isRequired,
  setAddressId: PropTypes.func.isRequired,
};

export default function AddressModal({
  isOpen,
  onClose,
  userData,
  addressId,
  setAddressId,
}) {
  // 신규 배송지 입력 폼 토글 상태
  const [isOpenForm, setIsOpenForm] = useState(false);
  // 주소 검색 iframe 오픈 상태
  const [isOpenIframe, setIsOpenIframe] = useState(false);

  // axios instance
  const axios = useAxiosInstance();

  // 전달 받은 유저 데이터를 변수에 할당
  const defaultAddress = userData.address;
  const addressBook = userData.extra?.addressBook;
  const userName = userData.extra?.userName || userData.name;

  // 신규 배송지 입력을 받기 위한 reack-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onSubmit", // 유효성 검사 실행 시점
  });

  const queryClient = useQueryClient();
  // 기본 배송지 추가 (배송지가 하나도 없는 상태)
  const addDefaultAddress = useMutation({
    mutationFn: async (formData) => {
      const defaultAddress = {
        phone: formData.phone,
        address: `${formData.value} ${formData.detailValue}`,
      };

      const ok = await ShowConfirmToast("주소를 등록하시겠습니까?");
      if (ok) {
        axios.patch(`/users/${userData._id}`, defaultAddress);
        toast.success("신규 주소가 등록되었습니다.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpenForm(false);
      reset();
    },
  });

  // 추가 배송지 추가
  const addAddress = useMutation({
    mutationFn: async (formData) => {
      // addressBook 속성이 없으면 에러가 나기에 빈배열로 할당
      const currentAddressBook = userData.extra?.addressBook || [];
      // 새롭게 추가될 주소를 더한 extra 속성
      const newAddress = {
        extra: {
          ...userData.extra,
          addressBook: [
            ...currentAddressBook,
            {
              // 처음 추가되는 주소라면 아이디를 1로, 아니라면 마지막 주소 아이디 + 1
              id: addressBook?.length
                ? addressBook[addressBook.length - 1].id + 1
                : 1,
              userName: formData.userName,
              name: formData.name,
              value: `${formData.value} ${formData.detailValue}`,
              phone: formData.phone,
            },
          ],
        },
      };

      const ok = await ShowConfirmToast("주소를 등록하시겠습니까?");
      if (ok) {
        axios.patch(`/users/${userData._id}`, newAddress);
        toast("신규 주소가 등록되었습니다.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpenForm(false);
      reset();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // 배송지 삭제
  const deleteAddress = useMutation({
    mutationFn: async (targetId) => {
      const filteredAddressList = addressBook.filter(
        (item) => item.id !== targetId
      );
      const newAddressList = {
        extra: {
          addressBook: filteredAddressList,
        },
      };
      const ok = await ShowConfirmToast("이 주소를 삭제하시겠습니까?");
      if (ok) axios.patch(`/users/${userData._id}`, newAddressList);
    },
    onSuccess: () => {
      toast("삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // 상태가 변경되면 모달 닫기
  if (!isOpen) return null;

  // 아래 3개 정보가 다 있으면 기본 배송지로 설정
  const RenderDefaultAddress = () => {
    if (userData.address)
      return (
        <div className="[&:not(:last-child)]:border-b border-gray2 py-3">
          <div className="flex mb-2 justify-between">
            <div className="flex flex-col gap-1">
              <span
                className={
                  addressId === 0
                    ? `text-base font-bold text-btn-primary`
                    : `text-base font-medium`
                }
              >
                {`${userName}`}
              </span>
              <span className="text-sm text-gray4">{userData.phone}</span>
            </div>
            <div>
              {addressId === 0 ? (
                <span className="text-sm text-btn-primary font-semibold">
                  선택됨
                </span>
              ) : (
                <Button onClick={() => setAddressId(0)}>선택</Button>
              )}
            </div>
          </div>
          <p className="text-sm font-regular mb-2">{defaultAddress}</p>
        </div>
      );
  };

  // extra.address 속성에 있는 주소 목록으로 추가 주소 렌더링
  const addressItem = addressBook?.map((item) => {
    return (
      <div
        key={item.id}
        className="[&:not(:last-child)]:border-b border-gray2 py-3"
      >
        <div className="flex mb-2 justify-between">
          <div className="flex flex-col gap-1">
            <span
              className={
                addressId === item.id
                  ? `text-base font-bold text-btn-primary`
                  : `text-base font-medium`
              }
            >
              {`${item.userName} (${item.name})`}
            </span>
            <span className="text-sm text-gray4">{item.phone}</span>
          </div>
          <div>
            {addressId === item.id ? (
              <span className="text-sm text-btn-primary font-semibold">
                선택됨
              </span>
            ) : (
              <Button onClick={() => setAddressId(item.id)}>선택</Button>
            )}
          </div>
        </div>
        <p className="text-sm font-regular mb-2">{item.value}</p>
        <div className="flex gap-2">
          <Button
            isWhite={true}
            color="white"
            onClick={() => deleteAddress.mutate(item.id)}
          >
            삭제
          </Button>
        </div>
      </div>
    );
  });
  console.log(userData);

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => {
          onClose();
          setIsOpenForm(false);
        }}
      />

      {/* 모달창 */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">배송지 목록</h2>
          <button
            onClick={() => {
              onClose();
              setIsOpenForm(false);
            }}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* 배송지 추가 버튼 */}
        <Button isBig={true} isWhite={true} onClick={() => setIsOpenForm(true)}>
          + 배송지 신규입력
        </Button>

        {/* 배송지 신규 입력창이 나타나면 배송지 목록은 사라짐 */}
        {isOpenForm ? (
          <>
            {/* 배송지 신규 입력 폼 */}
            <form
              onSubmit={
                userData.address && userData.name && userData.phone
                  ? handleSubmit(addAddress.mutate)
                  : handleSubmit(addDefaultAddress.mutate)
              }
              className="my-4 bg-gray1 p-3 rounded-lg"
            >
              <div className="mb-2.5 text-sm">
                <label htmlFor="sameAddress"></label>
                <label className="block mb-2.5 font-semibold" htmlFor="email">
                  받는 사람
                </label>
                <input
                  className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
                  type="text"
                  id="userName"
                  placeholder="받는 사람을 입력해주세요."
                  {...register("userName", {
                    required: "받는 사람을 입력해주세요.",
                  })}
                />
                {errors.userName && (
                  <p className="text-red1 text-xs mt-1 ps-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              <div className="mb-2.5 text-sm">
                <label className="block mb-2.5 font-semibold" htmlFor="email">
                  연락처
                </label>
                <input
                  className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
                  type="text"
                  id="phone"
                  // 모바일에서 숫자 키패드가 나타나도록 설정
                  inputMode="numeric"
                  placeholder="숫자만 입력해주세요."
                  {...register("phone", {
                    required: "연락처를 입력해주세요.",
                    pattern: {
                      value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
                      message: "올바른 전화번호 형식이 아닙니다.",
                    },
                  })}
                  onChange={(e) => {
                    // 숫자가 아닌 모든 문자 제거 (예: "010-1234-5678" → "01012345678")
                    const number = e.target.value.replace(/[^\d]/g, "");

                    // 하이픈 추가 로직
                    let formattedNumber = "";
                    if (number.length <= 3) {
                      formattedNumber = number;
                    } else if (number.length <= 7) {
                      formattedNumber = `${number.slice(0, 3)}-${number.slice(
                        3
                      )}`;
                    } else {
                      formattedNumber = `${number.slice(0, 3)}-${number.slice(
                        3,
                        7
                      )}-${number.slice(7, 11)}`;
                    }

                    // 입력값 업데이트
                    e.target.value = formattedNumber;
                  }}
                />
                {errors.phone && (
                  <p className="text-red1 text-xs mt-1 ps-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="mb-2.5 text-sm">
                <label className="block mb-2.5 font-semibold" htmlFor="email">
                  배송지명
                </label>
                <input
                  className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
                  type="text"
                  id="name"
                  placeholder="배송지명을 입력해주세요."
                  {...register("name", {
                    required: "배송지명을 입력해주세요.",
                  })}
                />
                {errors.name && (
                  <p className="text-red1 text-xs mt-1 ps-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="mb-2.5 text-sm mt-2.5">
                <label className="block mb-2.5 font-semibold">주소</label>
                <PostcodeSearch
                  isOpenIframe={isOpenIframe}
                  setIsOpenIframe={setIsOpenIframe}
                  register={register}
                  errors={errors}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="submit">저장</Button>
                <Button isWhite={true} onClick={() => setIsOpenForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <RenderDefaultAddress />
            {addressItem}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
