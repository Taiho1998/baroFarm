import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";
import downIcon from "/icons/icon_down_thin.svg";

const PurchaseModal = forwardRef(({ children }, ref) => {
  const dialogRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  const open = () => {
    setIsVisible(true);
    dialogRef.current?.showModal();
  };

  const close = () => {
    setIsVisible(false);
    dialogRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  return (
    <>
      {isVisible &&
        createPortal(
          <dialog
            ref={dialogRef}
            className="w-[390px] max-w-none backdrop:bg-black/50 border-t-[3px] border-btn-primary flex flex-col gap-8 p-5 pt-0 mb-0 fixed inset-0"
          >
            <form method="dialog">
              <button
                type="button"
                className="px-7 py-2 bg-btn-primary rounded-b-[10px] absolute top-0 left-1/2 transform -translate-x-1/2"
                onClick={close}
              >
                <img src={downIcon} className="w-6" />
              </button>
            </form>
            {children}
          </dialog>,
          document.getElementById("modal-root")
        )}
    </>
  );
});

export default PurchaseModal;
