import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

import closeIcon from "/icons/icon_x_black.svg";

const Modal = forwardRef(({ children }: { children: ReactNode }, ref) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="w-[250px] backdrop:bg-black/50 rounded-[10px] p-3 overflow-hidden"
    >
      <form method="dialog">
        <button className="block ml-auto hover:scale-125">
          <img src={closeIcon} className="w-6 " />
        </button>
      </form>
      <div className="flex flex-col justify-center items-center gap-3 py-4">
        {children}
      </div>
    </dialog>,
    modalRoot
  );
});

export default Modal;
