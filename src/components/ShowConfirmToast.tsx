import ConfirmToast from "@components/ConfirmToast";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toastify 설정

export default function ShowConfirmToast(message, onConfirm, onCancel) {
  return new Promise((resolve) => {
    toast(<ConfirmToast message={message} resolve={resolve} />, {
      position: "top-center",
      autoClose: false, // 자동 닫힘 비활성화
      closeOnClick: false, // 클릭으로 닫히지 않게
      draggable: false, // 드래그 비활성화
      closeButton: false, // 닫기 버튼 숨김
    });
  });
}
