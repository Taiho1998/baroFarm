export default function createdTime(createdDate: Date) {
  const formatRelativeTime = (inputDate: Date) => {
    const now: Date = new Date();
    const pastDate: Date = new Date(inputDate);
    const minDiff: number = Math.floor(
      (now.getTime() - pastDate.getTime()) / (1000 * 60)
    );

    if (minDiff < 1) return "방금 전";
    if (minDiff < 60) return `${minDiff}분 전`;
    if (minDiff < 1440) return `${Math.floor(minDiff / 60)}시간 전`;
    if (minDiff < 2880) return `${Math.floor(minDiff / 1440)}일 전`;

    // 이틀 이상인 경우에는 날짜를 표시
    return pastDate.toLocaleString();
  };
  return formatRelativeTime(createdDate);
}
