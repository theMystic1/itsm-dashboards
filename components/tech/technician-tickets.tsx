"use client";

import {
  dummyDashboardMetrics,
  dummyTicketMetrics,
} from "@/constants/constant";
import Text from "../ui/text";
import StatusItem from "../ui/status";
import Image from "next/image";
import { LOCAL_ICONS } from "@/constants/icons";
import Tickets from "../user/tickets/tickets";

const TechTicks = () => {
  return <Tickets type="tech" />;
};

export const TicketMetrics = ({ isTicket }: { isTicket: boolean }) => {
  const shitTorender = isTicket ? dummyTicketMetrics : dummyDashboardMetrics;

  const decIcon = isTicket ? LOCAL_ICONS.decIcon : LOCAL_ICONS.bad_marketIcon;
  return (
    <section className={`${isTicket ? "grid-3" : "grid-2"}`}>
      {shitTorender.map((mtr, i) => (
        <div
          className="tech-container flex items-start justify-between"
          key={i}
        >
          <div>
            <Text.Heading className="!text-xl">{mtr.value}</Text.Heading>
            <Text.Paragraph>{mtr.name}</Text.Paragraph>
            <div className="flex items-center gap-2">
              <StatusItem
                status={`${
                  mtr.percentage > 0 ? "resolved" : isTicket ? "open" : "danger"
                }`}
                name={`${mtr.percentage}%`}
                icon
                iconComponent={
                  mtr.percentage >= 0 ? (
                    <Image
                      src={LOCAL_ICONS.incIcon}
                      height={16}
                      width={16}
                      alt="Inc or dec icon"
                    />
                  ) : (
                    <Image
                      src={decIcon}
                      height={16}
                      width={16}
                      alt="Inc or dec icon"
                    />
                  )
                }
              />

              <Text.Paragraph className="text-xs text-gray-400">
                {mtr.duration}
              </Text.Paragraph>
            </div>
          </div>

          <div
            className={`h-10 w-10 relative flex items-center justify-center rounded-full ${
              isTicket
                ? i < 3
                  ? "bg-primary-600/10"
                  : i >= 3 && i < 5
                  ? "bg-[#FFE0E0]"
                  : i === 5
                  ? "bg-[#EBFFEB]"
                  : ""
                : i === 0
                ? "bg-green-300/20"
                : "bg-primary-300/20"
            } `}
          >
            <Image src={mtr.icon} height={24} width={24} alt="Icon" />
          </div>
        </div>
      ))}
    </section>
  );
};

export default TechTicks;
