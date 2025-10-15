"use client";

import Button from "@/components/ui/custom-btn";
import Text from "@/components/ui/text";
import TogleSlide, { useSyncedSlide } from "@/components/ui/toggle-slide";
import { LayoutHeader } from "@/components/user/tickets/tickets";
import PersonalAdmin from "./personal-info";
import { Row } from "@/components/user/create-ticket";
import SLAPolicies from "./SLA-policies";
import WorkFlowStages from "./workflow-stages";
import TicketPriorities from "./ticket-priorities";
import RolesPermissions from "./roles-permissions";
import RoutingRules from "./routing-rules";
import EmailNotifs from "./email-notifications";
import Integrations from "./integrations";
import AdminLanguage from "./language";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const AdminSettings = () => {
  const slides = [
    "Personal & Brand Info",
    "SLA Policies",
    "Workflow stages",
    "Ticket Priorities",
    "Roles & Permissions",
    "Routing Rules",
    "Email & Notification",
    "Integrations",
    "Language",
  ];

  const { activeSlide, setSlide } = useSyncedSlide(
    slides,
    "Personal & Brand Info",
    "toggle"
  );

  const prefersReduced = useReducedMotion();
  const distance = 28; // px slide distance

  const variants = {
    initial: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, x: distance, filter: "blur(4px)" }, // start right
    animate: prefersReduced
      ? { opacity: 1 }
      : { opacity: 1, x: 0, filter: "blur(0px)" }, // settle center
    exit: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, x: -distance, filter: "blur(4px)" }, // leave left
  };
  const renderSlide = () =>
    activeSlide.toLowerCase().includes("personal") ? (
      <PersonalAdmin />
    ) : activeSlide.toLowerCase().includes("sla policies") ? (
      <SLAPolicies />
    ) : activeSlide.toLowerCase().includes("workflow stages") ? (
      <WorkFlowStages />
    ) : activeSlide.toLowerCase().includes("ticket priorities") ? (
      <TicketPriorities />
    ) : activeSlide.toLowerCase().includes("roles & permissions") ? (
      <RolesPermissions />
    ) : activeSlide.toLowerCase().includes("routing rules") ? (
      <RoutingRules />
    ) : activeSlide.toLowerCase().includes("email") ? (
      <EmailNotifs />
    ) : activeSlide.toLowerCase().includes("integration") ? (
      <Integrations />
    ) : (
      <AdminLanguage />
    );

  return (
    <main className="white-bg min-h-screen flex flex-col gap-5">
      {/* -- your platform header (unchanged) -- */}
      <LayoutHeader title="Settings">
        <Button variant="secondary_2">Reset All to default</Button>
        <Button>Save All Changes</Button>
      </LayoutHeader>

      {/* tabs (unchanged) */}
      <div className="relative w-full max-h-[100px]">
        <div className="h-full overflow-x-auto overscroll-x-contain whitespace-nowrap scrollbar-hide [scrollbar-width:thin]">
          <div className="inline-block min-w-max">
            <TogleSlide
              slides={slides}
              activeSlide={activeSlide}
              onSlideChange={setSlide}
            />
          </div>
        </div>
      </div>

      {/* animated content only */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeSlide.toLowerCase()} // unique key per slide
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {renderSlide()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default AdminSettings;

/* keep your HeaderSettings component exactly as you had it */
export const HeaderSettings = ({
  header,
  paragraph,
  onReset,
  onSave,
}: {
  header: string;
  onReset?: () => void;
  onSave?: () => void;
  paragraph?: string;
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Text.Paragraph className="font-semibold text-base">
          {header}
        </Text.Paragraph>
        {paragraph && (
          <Text.Paragraph className="text-xs text-gray-400">
            {paragraph}
          </Text.Paragraph>
        )}
      </div>
      <Row>
        <Button variant="secondary_2" onClick={onReset}>
          Reset to default
        </Button>
        <Button onClick={onSave}>Save Changes</Button>
      </Row>
    </div>
  );
};
