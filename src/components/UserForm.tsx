import PostcodeSearch from "@components/PostcodeSearch";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { useForm } from "react-hook-form";

UserForm.propTypes = {
  // 수정기능 구현시 기존의 계정 정보를 입력받아올 props - userInfo
  // 회원가입 시에도 쓰이기에 userInfo는 isRequired가 아님
  userInfo: PropTypes.shape({
    // 프로필 수정 시 사용되는 필드들
    name: PropTypes.string, // 닉네임
    phone: PropTypes.string,
    address: PropTypes.string,
    email: PropTypes.string,
    type: PropTypes.string,
    extra: PropTypes.shape({
      userName: PropTypes.string,
      birth: PropTypes.string,
      gender: PropTypes.string,
    }),
  }),
  buttonText: PropTypes.string.isRequired,
  onSubmitUser: PropTypes.func.isRequired,
};

export default function UserForm({ userInfo, buttonText, onSubmitUser }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError, // register로 설정한 기본 유효성 검사 외에 추가적인 에러 처리가 필요할 때 사용(수동으로 에러 설정) => 서버에서 받은 에러 표시
    clearErrors, // 특정 필드나 모든 필드의 에러 상태를 제거
  } = useForm({
    defaultValues: {
      // input의 defaultValue 속성 대신 useForm의 defaultValues 옵션으로 초기값 설정
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      // extra: {
      //   userName: userInfo?.extra?.userName || "",
      // },
      type: userInfo?.type || "",
      // 수정 데이터가 넘어올 때만 phone, address 항목 생성
      ...(userInfo && {
        phone: userInfo?.phone || "",
        address: userInfo?.address || "",
        extra: {
          birth: userInfo?.extra?.birth || "",
          gender: userInfo?.extra?.gender || "",
        },
      }),
    },
    mode: "onBlur", // 유효성 검사가 실행되는 시점을 onBlur로 설정
  });

  const [isOpenIframe, setIsOpenIframe] = useState(false);

  // 코드 가독성을 위해 유효성 검사 규칙을 분리하여 관리
  const validationSchema = {
    // 회원가입 전용 필드
    email: {
      required: userInfo ? undefined : "이메일은 필수입니다.",
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: "이메일 형식으로 입력해 주세요.",
      },
      // onBlur: input 필드에서 포커스가 빠져나갈때(이메일 중복 체크)
      onBlur: async (e) => {
        // console.log("onBlur 실행됨");
        const email = e.target.value;
        // console.log("입력된 이메일:", email);

        // 이메일 형식이 올바른 경우에만 중복 체크(email 값이 존재 + 정규식 검사를 수행, 두 조건을 모두 확인)
        if (email && /\S+@\S+\.\S+/.test(email) && !userInfo) {
          try {
            console.log("axios 요청 직전");
            const { data } = await axios.get(
              "https://11.fesp.shop/users/email",
              {
                params: { email },
                headers: {
                  "client-id": "final04",
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              }
            );

            // ok 1이면 사용 가능(사용 가능한 이메일)
            if (data.ok === 1) {
              // console.log("서버 응답:", data);
              // 이전에 설정된 email 필드의 모든 에러 상태를 제거함 =>  setError로 설정된 에러를 초기화하여, 유효한 이메일 입력 시 오류 메시지가 자동으로 사라짐
              clearErrors("email");
            }
          } catch (error) {
            setError(
              "email",
              {
                // type: "manual"은 개발자가 직접(setError) 수동으로 에러를 설정할 때 사용하는 예약된 값
                type: "manual",
                message: "이미 등록된 이메일입니다.",
              }, // 오류가 발생한 필드로 포커스 자동으로 이동
              { shouldFocus: true }
            );
            console.error("이메일 에러:", error);
          }
        }
      },
    },
    password: {
      required: "비밀번호는 필수입니다.",
      minLength: { value: 8, message: "8자 이상 입력해주세요." },
    },
    confirmPassword: {
      required: "비밀번호를 확인해주세요.",
      // 기본 제공 되는 required,pattern 등으로는 처리할 수 없는 복잡한 유효성 검사를 할 때 사용(사용자 정의 유효성 검사 기능)
      validate: {
        matchPassword: (value) =>
          value === watch("password") || "비밀번호가 일치하지 않습니다.",
      },
    },
    type: { required: userInfo ? undefined : "회원 유형을 선택해주세요." },
    extra: {
      userName: {
        required: userInfo ? undefined : "이름은 필수입니다.",
        pattern: {
          value: /^[A-Za-z가-힣]+$/,
          message: "한글 또는 영문만 입력 가능합니다",
        },
      },
    },
    // 공통 필드(회원가입 및 프로필 수정 시 공통으로 사용)
    name: {
      required: "닉네임은 필수입니다.",
      onBlur: async (e) => {
        // console.log("onBlur 실행됨");
        const name = e.target.value;
        // console.log("입력된 닉네임:", name);

        if (name && !userInfo) {
          try {
            // console.log("axios 요청 직전");
            const { data } = await axios.get(
              "https://11.fesp.shop/users/name",
              {
                params: { name },
                headers: {
                  "client-id": "final04",
                  "Content-Type": "application/json",
                  accept: "application/json",
                },
              }
            );

            // ok 1이면 사용 가능(사용 가능한 닉네임)
            if (data.ok === 1) {
              // console.log("서버 응답:", data);
              clearErrors("name");
            }
          } catch (error) {
            setError(
              "name",
              {
                type: "manual",
                message: "이미 등록된 닉네임입니다.",
              },
              { shouldFocus: true }
            );
            console.error("닉네임 에러:", error);
          }
        }
      },
    },
    phone: {
      required: userInfo ? undefined : "전화번호는 필수입니다.",
      pattern: {
        value: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        message: "올바른 전화번호 형식이 아닙니다.",
      },
      onChange: (e) => {
        // 숫자가 아닌 모든 문자 제거 (예: "010-1234-5678" → "01012345678")
        const number = e.target.value.replace(/[^\d]/g, "");

        // 하이픈 추가 로직
        let formattedNumber = "";
        if (number.length <= 3) {
          formattedNumber = number;
        } else if (number.length <= 7) {
          formattedNumber = `${number.slice(0, 3)}-${number.slice(3)}`;
        } else {
          formattedNumber = `${number.slice(0, 3)}-${number.slice(
            3,
            7
          )}-${number.slice(7, 11)}`;
        }

        // 입력 값 업데이트
        e.target.value = formattedNumber;
      },
    },
  };

  // FormData에서 confirmPassword는 비밀번호 확인용으로만 사용되고 서버에는 보낼 필요가 없어서 제외시키는 작업
  // handleSubmit이 수집한 데이터를 handleFormSubmit함수의 첫번째 인자로 전달
  const handleFormSubmit = (formData) => {
    // ...submitData는 confirmPassword를 제외한 나머지 모든 속성
    const { confirmPassword, ...submitData } = formData;
    onSubmitUser(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-5">
      {!userInfo && (
        <>
          {/* 이메일 */}
          <div className="mb-2.5 text-sm">
            <label className="block mb-2.5 font-semibold" htmlFor="email">
              이메일
            </label>
            <input
              className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
              type="email"
              id="email"
              placeholder="이메일을 입력해주세요"
              {...register("email", validationSchema.email)}
            />
            {errors.email && (
              <p className="text-red1 text-xs mt-1 ps-1">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* 비밀번호 */}
          <div className="mb-2.5 text-sm">
            <label className="block mb-2.5 font-semibold" htmlFor="password">
              비밀번호
            </label>
            <input
              className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
              type="password"
              id="password"
              placeholder="비밀번호를 입력해주세요"
              {...register("password", validationSchema.password)}
            />
            {errors.password && (
              <p className="text-red1 text-xs mt-1 ps-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* 비밀번호 확인 */}
          <div className="mb-2.5 text-sm">
            <label
              className="block mb-2.5 font-semibold"
              htmlFor="confirmPassword"
            >
              비밀번호 확인
            </label>
            <input
              className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
              type="password"
              id="confirmPassword"
              placeholder="비밀번호를 한번 더 입력해주세요"
              {...register("confirmPassword", validationSchema.confirmPassword)}
            />
            {errors.confirmPassword && (
              <p className="text-red1 text-xs mt-1 ps-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </>
      )}
      {/* 닉네임 */}
      {userInfo && (
        <label className="block mb-2.5 font-semibold">개인 정보</label>
      )}
      <div className="mb-5 text-sm">
        <label className="block mb-2.5 font-semibold" htmlFor="name">
          닉네임
        </label>
        <input
          className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
          type="text"
          id="name"
          placeholder="닉네임을 입력해주세요 (최대 7자)"
          {...register("name", validationSchema.name)}
          maxLength={7}
        />
        {errors.name && (
          <p className="text-red1 text-xs mt-1 ps-1">{errors.name.message}</p>
        )}
      </div>

      {/* 회원 유형 */}
      {!userInfo && (
        <>
          <div className="flex flex-wrap items-center gap-5 text-sm mb-5 mt-5">
            <p className="font-semibold">회원 유형</p>
            <div className="flex items-center gap-1">
              <input
                className="w-3.5 h-3.5 rounded-full appearance-none bg-gray2 checked:bg-btn-primary cursor-pointer"
                type="radio"
                id="type-user"
                value="user"
                {...register("type", validationSchema.type)}
              />
              <label className="cursor-pointer" htmlFor="type-user">
                일반회원
              </label>
              <input
                className="w-3.5 h-3.5 rounded-full appearance-none bg-gray2 checked:bg-btn-primary cursor-pointer ml-2.5"
                type="radio"
                id="type-seller"
                value="seller"
                {...register("type", validationSchema.type)}
              />
              <label className="cursor-pointer" htmlFor="type-seller">
                판매회원
              </label>
            </div>
            {errors.type && (
              <div className="w-full">
                <p className=" text-red1 text-xs ps-0.5 -mt-3">
                  {errors.type.message}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {userInfo && (
        <>
          {/* 성별 */}
          <div className="flex flex-wrap items-center gap-5 text-sm mb-5">
            <p className="font-semibold">성별</p>
            <div className="flex items-center gap-1">
              <input
                className="w-3.5 h-3.5 rounded-full appearance-none bg-gray2 checked:bg-btn-primary cursor-pointer"
                type="radio"
                id="gender-male"
                value="male"
                {...register("extra.gender", validationSchema.extra.gender)}
              />
              <label className="cursor-pointer" htmlFor="gender-male">
                남자
              </label>
              <input
                className="w-3.5 h-3.5 rounded-full appearance-none bg-gray2 checked:bg-btn-primary cursor-pointer ml-2.5"
                type="radio"
                id="gender-female"
                value="female"
                {...register("extra.gender", validationSchema.extra.gender)}
              />
              <label className="cursor-pointer" htmlFor="gender-female">
                여자
              </label>
            </div>
          </div>

          {/* 생년월일 */}
          <div className="mb-10 text-sm">
            <label className="block mb-2.5 font-semibold" htmlFor="birth">
              생년월일
            </label>
            <input
              className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
              type="date"
              id="birth"
              {...register("extra.birth", validationSchema.extra.birth)}
            />
          </div>
          <label className="block mb-2.5 font-semibold">기본 배송지 정보</label>
          {/* 이름 */}
          <div className="mb-5 text-sm">
            <label className="block mb-2.5 font-semibold" htmlFor="userName">
              이름
            </label>
            <input
              className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
              type="text"
              id="userName"
              placeholder="이름을 입력해주세요"
              defaultValue={
                userInfo?.extra?.userName ? userInfo.extra.userName : ""
              }
              {...register("extra.userName", validationSchema.extra.userName)}
            />
          </div>

          {/* 전화번호 */}
          <div className="mb-2.5 text-sm">
            <label className="block mb-2.5 font-semibold" htmlFor="phone">
              전화번호
            </label>
            <input
              className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 mb-2.5 outline-none focus:border-btn-primary"
              type="tel"
              inputMode="numeric" // 모바일에서 숫자 키패드가 나타나도록 설정
              id="phone"
              placeholder="숫자만 입력해주세요"
              // defaultValue={userInfo ? userInfo.phone : ""}
              {...register("phone", validationSchema.phone)}
            />
            {errors.phone && (
              <p className="text-red1 text-xs -mt-1.5 ps-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* 주소 */}
          <div className="mb-6 text-sm">
            <label className="block mb-2.5 font-semibold" htmlFor="address">
              주소
            </label>
            <PostcodeSearch
              isOpenIframe={isOpenIframe}
              setIsOpenIframe={setIsOpenIframe}
              register={register}
              errors={errors}
            />
          </div>
        </>
      )}

      {/* 가입, 수정버튼 */}
      <button
        className="w-full h-[3.25rem] text-center text-xl rounded-full border border-btn-primary font-medium block m-auto mb-1 text-btn-primary"
        type="submit"
      >
        {buttonText}
      </button>
    </form>
  );
}
