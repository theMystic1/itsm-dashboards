"use client";

import Text from "./text";

const Badge = ({
  count,
  isActive,
  color,
}: {
  count: number | string;
  isActive: boolean;
  color?: string;
}) => {
  if (!isActive) return null;
  return (
    <span className="h-4 min-w-4 rounded-full bg-green-600 text-light-main flex items-center justify-center ">
      <Text.SmallText className="text-[10px] text-white">
        {Number(count) > 99 ? "99+" : count}
      </Text.SmallText>
    </span>
  );
};

export default Badge;
