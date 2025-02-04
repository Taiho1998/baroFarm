import Button from "@components/Button";
import PropTypes from "prop-types";
import { useState } from "react";

ProductInfoForm.propTypes = {
  handlesubmit: PropTypes.func,
  register: PropTypes.func.isRequired,
  errors: PropTypes.shape(),
  price: PropTypes.any,
  setPrice: PropTypes.func,
  isEdit: PropTypes.bool,
  editInfo: PropTypes.shape(),
};

export default function ProductInfoForm({
  register,
  handlesubmit,
  errors,
  price,
  setPrice,
  isEdit = false,
  editInfo,
}) {
  const [tag, setTag] = useState(
    editInfo && editInfo.extra.category ? editInfo.extra.category : ""
  );
  const [checkDiscount, setCheckDiscount] = useState(
    editInfo && editInfo.extra.sale !== 0 ? true : false
  );
  // 숫자만 남기기
  const handlePriceChange = (e) => {
    setPrice(parseInt(e.target.value.replace(/[^0-9]/g, "")));
  };

  //price 값을 string값으로 변화
  const priceToString = price ? Number(price).toLocaleString() : "";

  //상품 상세 정보 편집의 경우 가격을 변화하지 않음
  if (editInfo) {
    setPrice(editInfo.price);
  }

  return (
    <form className="mx-5 py-5" onSubmit={handlesubmit}>
      <input
        name="name"
        id="name"
        type="text"
        className="bg-gray2/20 w-full h-[50px] px-4 focus:outline-btn-primary rounded-md"
        placeholder="상품명을 입력해주세요."
        {...register("name", {
          required: "필수 입력 정보입니다",
        })}
        defaultValue={editInfo ? editInfo.name : ""}
      />
      {errors.name && (
        <p className="text-red1 text-xs mt-1 ps-1">{errors.name.message}</p>
      )}

      <select
        id="category"
        name="category"
        type="text"
        value={tag}
        className={`mt-[25px] text-center bg-gray2 rounded-lg py-1  pe-6 appearance-none focus:outline-none cursor-pointer
        bg-[url('/icons/icon_dropdown.svg')] bg-no-repeat bg-[center_right_0.5rem] w-1/2`}
        {...register("category", {
          required: "필수 입력 정보입니다",
          onChange: (e) => setTag(e.target.value),
        })}
      >
        <option value="">카테고리</option>
        <option value="fruit">과일</option>
        <option value="vegetable">채소</option>
        <option value="kimchi">김치</option>
        <option value="liveStock">축산물</option>
        <option value="seafood">수산물</option>
        <option value="simple">간편식</option>
        <option value="rice">쌀</option>
        <option value="riceCake">떡</option>
      </select>
      {errors.category && (
        <p className="text-red1 text-xs mt-1 ps-1">{errors.category.message}</p>
      )}
      {tag === "fruit" && (
        <>
          <label className="font-bold block mt-[25px] mb-2">
            제철 지정 (선택)
          </label>
          <select
            className="text-center bg-gray2 rounded-lg py-1 pe-6 appearance-none focus:outline-none cursor-pointer
        bg-[url('/icons/icon_dropdown.svg')] bg-no-repeat bg-[center_right_0.5rem] w-1/3"
            type="month"
            id="seasonStart"
            name="seasonStart"
            {...register("seasonStart")}
            required
            defaultValue={
              editInfo && editInfo.extra.category === "fruit"
                ? editInfo.extra.bestSeason[0]
                : ""
            }
          >
            <option value="1">1월</option>
            <option value="2">2월</option>
            <option value="3">3월</option>
            <option value="4">4월</option>
            <option value="5">5월</option>
            <option value="6">6월</option>
            <option value="7">7월</option>
            <option value="8">8월</option>
            <option value="9">9월</option>
            <option value="10">10월</option>
            <option value="11">11월</option>
            <option value="12">12월</option>
          </select>
          <span className="mx-[0.5rem]">~</span>
          <select
            className=" text-center bg-gray2 rounded-lg py-1 pe-6 appearance-none focus:outline-none cursor-pointer
        bg-[url('/icons/icon_dropdown.svg')] bg-no-repeat bg-[center_right_0.5rem] w-1/3"
            type="month"
            id="seasonEnd"
            name="seasonEnd"
            {...register("seasonEnd")}
            required
            defaultValue={
              editInfo && editInfo.extra.category === "fruit"
                ? editInfo.extra.bestSeason[1]
                : ""
            }
          >
            <option value="1">1월</option>
            <option value="2">2월</option>
            <option value="3">3월</option>
            <option value="4">4월</option>
            <option value="5">5월</option>
            <option value="6">6월</option>
            <option value="7">7월</option>
            <option value="8">8월</option>
            <option value="9">9월</option>
            <option value="10">10월</option>
            <option value="11">11월</option>
            <option value="12">12월</option>
          </select>
        </>
      )}
      <textarea
        name="content"
        className="border-2 border-white w-full mt-[25px] h-[200px] p-3 bg-gray2/20 outline-none focus:border-btn-primary rounded-md"
        placeholder="상품 소개문을 입력해주세요."
        {...register("content", {
          required: "필수 입력 정보입니다",
        })}
        defaultValue={
          editInfo ? editInfo.content.replace(/^<p>|<\/p>$/g, "") : ""
        }
      ></textarea>
      {errors.content && (
        <p className="text-red1 text-xs ps-1 -mt-1">{errors.content.message}</p>
      )}
      {!editInfo && (
        <>
          <label className="font-bold block mt-[15px]">판매 희망 가격</label>
          <div className="relative w-full mt-[10px]">
            <input
              type="text"
              name="price"
              value={priceToString}
              className="bg-gray2/20 w-full h-[50px] pr-12 px-4 focus:text-right placeholder:text-left focus:outline-btn-primary rounded-md"
              placeholder="가격을 입력하세요"
              {...register("price", {
                required: "필수 입력 정보입니다",
                onChange: handlePriceChange,
              })}
            />

            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600">
              원
            </span>
          </div>
          {errors.price && (
            <p className="text-red1 text-xs mt-1 ps-1">
              {errors.price.message}
            </p>
          )}
        </>
      )}

      <label className="font-bold block mt-[15px]">판매 희망 개수</label>
      <input
        type="number"
        name="quantity"
        className="bg-gray2/20 w-full h-[50px] px-4 mt-[10px] focus:outline-btn-primary rounded-md"
        placeholder="판매 개수를 입력하세요"
        {...register("quantity", {
          required: "필수 입력 정보입니다",
        })}
        defaultValue={editInfo ? editInfo.quantity : ""}
      />
      {errors.quantity && (
        <p className="text-red1 text-xs mt-1 ps-1">{errors.quantity.message}</p>
      )}

      <div className="flex gap-1 items-center my-[25px]">
        <p className="font-bold">할인을 적용하시겠습니까?</p>
        <input
          type="radio"
          className="w-3.5 h-3.5 rounded-full appearance-none bg-gray2 checked:bg-btn-primary cursor-pointer ml-3"
          name="discount"
          id="discount-true"
          value="true"
          defaultChecked={editInfo && editInfo.extra.sale !== 0 ? true : false}
          required
          onChange={() => {
            setCheckDiscount(true);
          }}
        />
        <label className="cursor-pointer" htmlFor="discount-true">
          예
        </label>
        <input
          type="radio"
          className="w-3.5 h-3.5 rounded-full appearance-none bg-gray2 checked:bg-btn-primary cursor-pointer ml-3"
          name="discount"
          id="discount-false"
          value="false"
          defaultChecked={!editInfo || editInfo.extra.sale === 0 ? true : false}
          required
          onChange={() => {
            setCheckDiscount(false);
          }}
        />
        <label className="cursor-pointer" htmlFor="discount-false">
          아니오
        </label>
      </div>
      {checkDiscount && (
        <div className="mb-[25px]">
          <label className="font-bold block mt-[25px]">할인률 %</label>
          <div className="relative w-full">
            <input
              id="sale"
              name="sale"
              type="text"
              className="bg-gray2/20 w-full h-[50px] pr-12  focus:text-right px-4 mt-[10px] focus:outline-btn-primary rounded-md"
              placeholder="1 ~ 99 까지의 할인율을 입력하세요"
              {...register("sale", {
                required: "필수 입력 정보입니다",
                validate: (value) => {
                  const sale = parseInt(value); // 현재 sale의 값
                  return (
                    (sale >= 1 && sale <= 99) ||
                    "1~99 사이의 숫자여야만 합니다."
                  );
                },
              })}
              defaultValue={editInfo ? editInfo.extra.sale : ""}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/4 text-gray-600">
              %
            </span>
          </div>
          {errors.sale && (
            <p className="text-red1 text-xs mt-1 ps-1">{errors.sale.message}</p>
          )}
        </div>
      )}
      {!isEdit && (
        <>
          <label className="font-bold">이미지 첨부</label>
          <input
            type="file"
            id="attach"
            accept="image/*"
            placeholder="이미지를 선택하세요"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 mt-[10px] focus:outline-btn-primary mb-[25px]"
            name="attach"
            {...register("image", {
              required: "이미지 파일을 선택해주세요.",
            })}
            required
          />
        </>
      )}
      <Button height="45px" fontSize={24} type="submit" isBig={true}>
        등록
      </Button>
    </form>
  );
}
