"use client";
import {
  BiGridAlt,
  BiCog,
  BiUser,
  BiNotepad,
  BiLineChart,
  BiBell,
  BiHistory,
  BiNote,
  BiSolidNotepad,
  BiArrowToRight,
  BiChat,
} from "react-icons/bi";
import { VscTools } from "react-icons/vsc";
import { CgNotes } from "react-icons/cg";

import { IconType } from "react-icons";
import { MdEmail } from "react-icons/md";
import { PiPhone } from "react-icons/pi";
import { PiUsersThree } from "react-icons/pi";

import vectorIcon from "@/public/icons/Vector.png";
import clockIcon from "@/public/icons/clock.png";
import completeIcon from "@/public/icons/complete.png";
import dashIcon from "@/public/icons/dash.png";
import starIcon from "@/public/icons/star.png";
import timeIcon from "@/public/icons/time.png";
import warningIcon from "@/public/icons/warning.png";
import incIcon from "@/public/icons/inc.png";
import decIcon from "@/public/icons/dec.png";
import bad_marketIcon from "@/public/icons/bad_market.png";

export const ICONS = {
  dashboard: BiGridAlt,
  settings: BiCog,
  user: PiUsersThree,
  issues: BiNotepad,
  analytics: BiLineChart,
  notifications: BiBell,
  audit: BiHistory,
  tickets: CgNotes,
  tools: VscTools,
  arrowRight: BiArrowToRight,
  chat: BiChat,
  email: MdEmail,
  call: PiPhone,
} satisfies Record<string, IconType>;
export type IconKey = keyof typeof ICONS;

export const LOCAL_ICONS = {
  vectorIcon,
  clockIcon,
  completeIcon,
  dashIcon,
  starIcon,
  timeIcon,
  warningIcon,
  incIcon,
  decIcon,
  bad_marketIcon,
};
