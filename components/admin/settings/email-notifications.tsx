"use client";

import NotificationPreference from "@/components/user/settings/notif-pref";
import { HeaderSettings } from ".";

const EmailNotifs = () => {
  return (
    <section className="flex flex-col gap-5">
      <HeaderSettings
        header="Notification Preference"
        paragraph="Adjust your email and notification preferences for better communication and timely updates."
      />
      <NotificationPreference />
    </section>
  );
};

export default EmailNotifs;
