export default function PhotoReviewItem({ image }) {
  return (
    <img
      src={`https://11.fesp.shop${image}`}
      className="w-[100px] h-[100px] object-cover rounded-md items-center border flex-shrink-0"
    />
  );
}
