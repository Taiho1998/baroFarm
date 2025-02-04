import PropTypes from "prop-types";

Header.propTypes = {
  leftChild: PropTypes.node,
  title: PropTypes.node,
  rightChild: PropTypes.node,
};

export default function Header({ leftChild, title, rightChild }) {
  return (
    <header className="flex bg-white max-w-[390px] mx-auto h-[70px] px-5 items-center justify-between border-b border-gray3 fixed top-0 left-0 right-0 z-10 *:flex">
      <div className="shrink-0 w-[25%]">{leftChild}</div>
      <div className="justify-center grow w-[50%] text-[18px] font-semibold *:h-[70px]">
        {title}
      </div>
      <div className="shrink-0 w-[25%] gap-[10px] justify-end *:flex relative">
        {rightChild}
      </div>
    </header>
  );
}
