import Button from "@components/Button";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

PostcodeSearch.propTypes = {
  isOpenIframe: PropTypes.bool.isRequired,
  setIsOpenIframe: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default function PostcodeSearch({
  isOpenIframe,
  setIsOpenIframe,
  register,
  errors,
}) {
  // 주소 검색 iframe에 접근
  const iframeRef = useRef(null);
  // 배송지 주소 상태 관리
  const [address, setAddress] = useState({});

  // 다이나믹 하게 스크립트 추가
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    // 메모리 누수 방지를 위해 컴포넌트 언마운트시 스크립트 제거
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 주소 입력 iframe을 실행할 함수
  function execDaumPostcode() {
    new window.daum.Postcode({
      // 주소 입력 완료시 실행될 함수
      oncomplete: function (data) {
        console.log("주소 검색 결과:", data);
        setAddress({
          postcode: data.zonecode,
          address: data.address,
          bname: data.bname,
        });
        setIsOpenIframe(false);
      },
      width: "100%",
      height: "100%",
      // 내부
      onresize: function (size) {
        iframeRef.current.style.height = size.height + 4 + "px";
      },
    }).embed(iframeRef.current);

    // 주소 검색 iframe 보이기
    setIsOpenIframe(true);
  }

  return (
    <div>
      <Button isWhite={true} onClick={() => execDaumPostcode()}>
        주소 검색
      </Button>

      {Object.keys(address).length > 0 && (
        <div>
          <input
            type="text"
            className="border border-gray3 rounded-md w-full p-2 outline-none"
            value={`(${address.postcode}) ${address.address} (${address.bname})`}
            disabled
            {...register("value")}
          />

          <input
            className="border border-gray3 rounded-md w-full p-2 placeholder:font-thin placeholder:text-gray4 outline-none focus:border-btn-primary"
            type="text"
            placeholder="상세주소"
            autoFocus
            {...register("detailValue", {
              required: "상세주소를 입력해주세요.",
            })}
          />
          {errors.detailValue && (
            <p className="text-red1 text-xs mt-1 ps-1">
              {errors.detailValue.message}
            </p>
          )}
        </div>
      )}

      <div
        id="wrap"
        ref={iframeRef}
        className={`bg-red-100 border border-solid w-auto my-1 relative ${
          isOpenIframe ? "visible" : "hidden"
        }`}
      >
        <img
          src="//t1.daumcdn.net/postcode/resource/images/close.png"
          id="btnFoldWrap"
          className="cursor-pointer absolute right-0 top-0 z-10"
          onClick={() => setIsOpenIframe(false)}
          alt="접기 버튼"
        />
      </div>
    </div>
  );
}
