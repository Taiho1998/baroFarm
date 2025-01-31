import createdTime from "@utils/createdTime.js";
import PropTypes from "prop-types";
import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

BoardPageDetail.propTypes = {
  item: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    _id: PropTypes.number.isRequired,
    repliesCount: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
    }),
    image: PropTypes.string,
  }),
};

export default function BoardPageDetail({ item }) {
  const containerRef = useRef(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const checkOverflow = () => {
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current;
      setIsOverflow(scrollHeight > clientHeight); // 높이 비교
    }
  };
  useEffect(() => {
    checkOverflow();
  }, []);

  const newDate = createdTime(item.createdAt);
  return (
    <div className="relative">
      <Link to={`/board/${item._id}`}>
        <div
          ref={containerRef}
          className="max-h-[550px] overflow-hidden relative"
        >
          <div className="flex flex-row mt-5 items-center">
            <img
              src={
                item.user.image
                  ? item.user.image.includes("http://") ||
                    item.user.image.includes("https://")
                    ? item.user.image
                    : `https://11.fesp.shop${item.user.image}`
                  : "/images/profile/ProfileImage_Sample.jpg"
              }
              alt="ProfileImage"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="mx-[5px] text-sm">{item.user.name}</span>

            <span className="ml-auto text-xs self-start">
              댓글 {item.repliesCount}개
            </span>
          </div>
          <div className="mx-[5px] mt-[30px]">
            {item.content.split("<br/>").map((line, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </div>
          <div className="mt-10">
            {item.image && (
              <img
                className="relative rounded-md mx-auto"
                src={`https://11.fesp.shop${item.image}`}
                onLoad={() => checkOverflow()}
              />
            )}
            {isOverflow && (
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
          </div>
        </div>
        <span className="text-[10px] text-gray4 text-left mb-5 block">
          {newDate}
        </span>
      </Link>
      <div className="h-[7px] bg-gray1 -mx-5"></div>
    </div>
  );
}
