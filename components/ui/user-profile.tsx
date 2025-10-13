"use client";

import Image from "next/image";
import Badge from "./badge";
import { IMAGES } from "@/constants/images";
import Text from "./text";
import { BsBell } from "react-icons/bs";
import Dropdown from "./dropdown";
import { useRouter } from "next/navigation";

const UserProffileHeader = ({ textColor }: { textColor: string }) => {
  const router = useRouter();

  const handleNavigate = (route: string) => {
    router.replace(route);
  };
  const notificationsCount = 100;
  return (
    <div className="flex items-center gap-5">
      <button
        // ref={bellRef}

        className="
            relative h-10 w-10 rounded-full
            flex items-center justify-center
            bg-light-300/70 hover:bg-light-300 active:bg-light-400
            transition-[background,transform,box-shadow] duration-200
            outline-none
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-500 focus-visible:ring-offset-light-main
          "
        // aria-label={
        //   Number(badgeCount) > 0
        //     ? `${badgeCount} new notifications`
        //     : "Notifications"
        // }
      >
        {/* Badge */}
        {notificationsCount > 0 && (
          <span
            className="
                absolute top-2 right-2
                translate-x-1 -translate-y-1
                pointer-events-none
              "
          >
            <Badge count={notificationsCount} isActive />
          </span>
        )}

        {/* Icon */}
        <BsBell
          className={`h-5 w-5 text-dark-main/80 ${textColor}`}
          aria-hidden="true"
          focusable="false"
        />
      </button>
      <Dropdown>
        <Dropdown.Trigger className="flex items-center gap-2" isNormal>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 relative">
              <Image
                src={IMAGES.userLanding}
                fill
                alt="Profile image"
                className="rounded-full"
              />
            </div>
            <div className={`${textColor}`}>
              <Text.Paragraph className="font-semibold text-base text-start">
                Bassey Bassey
              </Text.Paragraph>
              <Text.Paragraph className="font-normal text-base text-start">
                bassey.bassey@gmail.com
              </Text.Paragraph>
            </div>
          </div>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Text.Paragraph className="font-bold">
            Switch dashboard
          </Text.Paragraph>

          <Dropdown.Item onClick={() => handleNavigate("/")}>
            <Text.Paragraph className="font-semibold">User</Text.Paragraph>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleNavigate("/tech-dashboard")}>
            <Text.Paragraph className="font-semibold">
              Technician
            </Text.Paragraph>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleNavigate("/dashboard")}>
            <Text.Paragraph className="font-semibold">Admin</Text.Paragraph>
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    </div>
  );
};

export default UserProffileHeader;
