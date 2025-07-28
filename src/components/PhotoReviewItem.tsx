export default function PhotoReviewItem({ image }: { image: string }) {
  return (
    <img
      src={`https://fesp-api.koyeb.app/market${image}`}
      className='w-[100px] h-[100px] object-cover rounded-md items-center border flex-shrink-0'
    />
  );
}
