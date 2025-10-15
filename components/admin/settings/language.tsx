"use client";

import LanguageLocalization from "@/components/user/settings/language-locals";
import { HeaderSettings } from ".";

const AdminLanguage = () => {
  return (
    <section className="flex flex-cols gap-5">
      <HeaderSettings
        header="Language & Localization"
        paragraph="Set your language preferences for a better experience and smooth communication."
      />

      <LanguageLocalization />
    </section>
  );
};

export default AdminLanguage;
