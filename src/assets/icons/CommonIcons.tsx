import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

interface IconProps {
  size?: number;
  color?: string;
}

interface HeartIconProps extends IconProps {
  filled?: boolean;
}

// 뒤로가기 아이콘
export function LeftIcon({ size = 24, color = "#171717" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 20L8 12L16 4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 편집 아이콘
export function EditIcon({ size = 24, color = "#7C7C7C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20H21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 오른쪽 화살표 아이콘
export function RightIcon({ size = 24, color = "#171717" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 4L16 12L8 20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// FE settings and follow designs use simple stroke-based utility icons not covered by the old set.
export function XmarkIcon({ size = 24, color = "#9CA3AF" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6L6 18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M6 6L18 18"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function ToggleOnIcon({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={(size * 20) / 36} viewBox="0 0 36 20" fill="none">
      <Path
        d="M10 1H26C30.9706 1 35 5.02944 35 10C35 14.9706 30.9706 19 26 19H10C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z"
        fill="#7DC960"
      />
      <Circle cx={26} cy={10} r={7} fill="#FFFFFF" />
    </Svg>
  );
}

export function ToggleOffIcon({ size = 36 }: IconProps) {
  return (
    <Svg width={size} height={(size * 20) / 36} viewBox="0 0 36 20" fill="none">
      <Path
        d="M10 1H26C30.9706 1 35 5.02944 35 10C35 14.9706 30.9706 19 26 19H10C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1Z"
        fill="#D1D5DB"
      />
      <Circle cx={10} cy={10} r={7} fill="#FFFFFF" />
    </Svg>
  );
}

// 하트 아이콘 (좋아요)
export function HeartIcon({
  size = 24,
  color = "#7C7C7C",
  filled = false,
}: HeartIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.4583 4.70559C19.9696 4.20109 19.3894 3.80089 18.7508 3.52784C18.1121 3.2548 17.4276 3.11426 16.7364 3.11426C16.0451 3.11426 15.3606 3.2548 14.722 3.52784C14.0834 3.80089 13.5031 4.20109 13.0144 4.70559L12.0002 5.75211L10.986 4.70559C9.99891 3.68701 8.66009 3.11479 7.2641 3.11479C5.8681 3.11479 4.52928 3.68701 3.54216 4.70559C2.55505 5.72416 2.00049 7.10564 2.00049 8.54613C2.00049 9.98661 2.55505 11.3681 3.54216 12.3867L4.55637 13.4332L12.0002 21.1143L19.4441 13.4332L20.4583 12.3867C20.9472 11.8824 21.3351 11.2837 21.5997 10.6247C21.8643 9.96574 22.0005 9.25943 22.0005 8.54613C22.0005 7.83282 21.8643 7.12651 21.5997 6.46754C21.3351 5.80857 20.9472 5.20985 20.4583 4.70559Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </Svg>
  );
}

// 채팅/댓글 아이콘
export function ChatIcon({ size = 20, color = "#7C7C7C" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10.0001 19C11.963 18.9996 13.872 18.3574 15.4361 17.1713C17.0002 15.9853 18.1336 14.3204 18.6637 12.4304C19.1938 10.5404 19.0914 8.52892 18.3722 6.70249C17.653 4.87606 16.3564 3.33484 14.68 2.31369C13.0036 1.29254 11.0393 0.847472 9.08644 1.0463C7.1336 1.24513 5.29931 2.07695 3.8631 3.41501C2.42689 4.75306 1.46751 6.52398 1.13116 8.45788C0.794818 10.3918 1.09995 12.3826 2.00007 14.127L1.00007 19L5.87307 18C7.10907 18.639 8.51307 19 10.0001 19Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.5 10H5.51V10.01H5.5V10ZM10 10H10.01V10.01H10V10ZM14.5 10H14.51V10.01H14.5V10Z"
        stroke={color}
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// 팔로우 아이콘 (유저 + 플러스)
export function UserPlusIcon({ size = 24, color = "#171717" }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16 17.9951H22"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M19.0039 15L19.0039 21"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 전송 아이콘
export function SendIcon({ size = 32 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Circle cx={16} cy={16} r={16} fill="#7DC960" />
      <Path
        d="M9 16H23M23 16L16 9M23 16L16 23"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
