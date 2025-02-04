import PhotoReviewItem from "@components/PhotoReviewItem";
import PropTypes from "prop-types";

ReviewItem.propTypes = {
  reply: PropTypes.shape({
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    rating: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  productName: PropTypes.string.isRequired,
};

export default function ReviewItem({ reply, productName }) {
  const dateOnly = reply.createdAt.split(" ")[0];

  return (
    <div className="p-5 border-b-8 border-b-gray1">
      <p className="text-sm font-semibold">{reply.user.name}</p>
      <span className="text-xs font-semibold pr-2">
        {Array(reply.rating).fill("⭐️")}
      </span>

      <span className="text-[10px] font-normal text-gray5">{dateOnly}</span>

      <div className="relative mt-3 ">
        {reply.extra && reply.extra.image ? (
          <>
            <span className="absolute w-full"></span>
            <PhotoReviewItem image={reply.extra.image} />
          </>
        ) : (
          <span className="absolute w-full border-[0.5px] border-gray-3"></span>
        )}
      </div>

      <p className="mt-7 text-sm font-medium text-gray4">옵션: {productName}</p>
      <p className="mt-1 text-sm font-medium ">{reply.content}</p>
    </div>
  );
}
