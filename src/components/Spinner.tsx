import { BeatLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="absolute top-28 left-1/2 -translate-x-1/2">
      <BeatLoader color="#72c079" />
    </div>
  );
}
