import { IconKey } from "@/constants/icons";
import { ReactNode } from "react";

export type NavItem = {
  name: string;
  href: string;
  icon: IconKey;
  description?: string;
}[];

export type ChildType = {
  children: ReactNode;
};
export type Istatus = "open" | "danger" | "progress" | "resolved" | "waiting";
export type IPriority = "critical" | "high" | "medium" | "low";

export type IProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export type StatusType = {
  status: Istatus;
  name: string;
  dot?: boolean;
  icon?: boolean;
  iconComponent?: ReactNode;
};

export type User = { id: string; name: string; avatarUrl: string };

export type Activity =
  | {
      id: string;
      type: "status_change";
      actor: User;
      at: string; // ISO
      from: Istatus;
      to: Istatus;
    }
  | {
      id: string;
      type: "comment";
      actor: User;
      at: string;
      text: string;
      ticketId: string;
    }
  | {
      id: string;
      type: "ticket_created";
      actor: User;
      at: string;
      ticketId: string;
      initial: Istatus;
      next: Istatus;
    };

export type TogleSlideProps = {
  slides: string[];
  activeSlide: string;
  onSlideChange?: (slide: string) => void;
  paramKey?: string; // optional: which query key to use
};
