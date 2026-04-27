export const onboardingSlides = [
  {
    id: 1,
    image: require("@/assets/images/onboarding/onboarding1.png"),
    title: "나만의 식물을 화면 속에서 만나보세요",
    subtitle: "물과 햇빛을 주며 직접 키울 수 있어요",
  },
  {
    id: 2,
    image: require("@/assets/images/onboarding/onboarding2.png"),
    title: "실제 식물을 배송받아 키워보세요",
    subtitle: "식물 아바타에 해당하는 실제 식물을 키울 수 있어요",
  },
  {
    id: 3,
    image: require("@/assets/images/onboarding/onboarding3.png"),
    title: "미션을 통해 나무 레벨을 올리고\n새로운 식물을 키울 수 있어요",
    subtitle: "미션 기록은 키움일지에 기록돼요",
  },
  {
    id: 4,
    image: require("@/assets/images/onboarding/onboarding4.png"),
    title: "다른 친구들의 이야기를 들을 수 있어요",
    subtitle: "둘러보기로 친구를 만들고 방명록을 남겨보세요",
  },
] as const;

export type OnboardingSlide = (typeof onboardingSlides)[number];
