"use client";

import { StatusType } from "@/types/type";
import Text from "./text";

const StatusItem = ({
  status = "waiting",
  name,
  dot,
  icon,
  iconComponent,
}: StatusType) => {
  const colors = `
  ${
    status === "open"
      ? "bg-silver-light text-silver-dark"
      : status === "danger"
      ? "bg-red-light text-red-dark "
      : status === "progress"
      ? "bg-yellow-light text-yellow-dark"
      : status === "resolved"
      ? "bg-green-light text-green-dark"
      : status === "waiting"
      ? "bg-auto-mid text-yellow-dark"
      : "bg-silver-light text-silver-dark"
  }`;
  const dotColor = `
  ${
    status === "open"
      ? "bg-silver-dark"
      : status === "danger"
      ? "bg-red-dark "
      : status === "progress"
      ? "bg-yellow-dark"
      : status === "resolved"
      ? "bg-green-dark"
      : status === "waiting"
      ? "bg-yellow-dark"
      : "bg-silver-dark"
  }`;

  return (
    <div
      className={`flex items-center justify-center gap-2 ${colors} px-8 py-2 rounded-full min-w-28 `}
    >
      {dot ? (
        <div className={`${dotColor} h-2 min-w-2 rounded-full`} />
      ) : icon ? (
        iconComponent
      ) : null}
      <Text.SmallText>{name}</Text.SmallText>
    </div>
  );
};

export default StatusItem;
