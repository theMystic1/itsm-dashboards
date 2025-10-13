"use client";

import Button from "@/components/ui/custom-btn";
import { LayoutHeader } from "../tickets/tickets";
import TogleSlide, { useSyncedSlide } from "@/components/ui/toggle-slide";
import ProfileSettings from "./profile-setting";
import NotificationPreference from "./notif-pref";
import LanguageLocalization from "./language-locals";
import { Suspense } from "react";

const UsersSettings = ({ type }: { type: "user" | "tech" }) => {
  // use context for global state for all settings
  const slides = [
    "Profile information",
    "Notification Preference",
    "Language / Localization",
  ];

  const { activeSlide, setSlide } = useSyncedSlide(
    slides,
    "Profile information",
    "slide"
  );

  return (
    <main className=" min-h-screen white-bg ">
      <LayoutHeader title="Settings">
        <Button variant="secondary_2">Reset All Changes</Button>

        <Button>Save Changes</Button>
      </LayoutHeader>
      <section className="h-full flex flex-col gap-5">
        <Suspense>
          <TogleSlide
            activeSlide={activeSlide}
            onSlideChange={setSlide}
            slides={slides}
          />
        </Suspense>

        {activeSlide.toLowerCase().includes("profile") ? (
          <ProfileSettings />
        ) : activeSlide.toLowerCase().includes("notification") ? (
          <NotificationPreference />
        ) : (
          <LanguageLocalization />
        )}
      </section>
    </main>
  );
};

export default UsersSettings;
