// 오늘 날짜 기준 30일 내에 등록된 상품만 필터링하는 함수
const getMonthlyData = (data) => {
  // 30일 전을 시작 시간으로 잡는다.
  const beginTime = new Date().getTime() - 2592000 * 1000;

  // 시작 시간보다 뒤에 생성된 아이템만 필터링
  return data.filter((item) => beginTime <= new Date(item.createdAt).getTime());
};

export default getMonthlyData;
