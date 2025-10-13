"use client";

import Dropdown from "@/components/ui/dropdown";
import Text from "@/components/ui/text";
import { dummyLanguages, dummyTimeZones } from "@/constants/constant";
import { useState } from "react";

const LanguageLocalization = () => {
  const [langLoc, setLangLoc] = useState({
    language: dummyLanguages[0],
    timezone: dummyTimeZones[0],
  });

  const handleLangLoc = ({
    type,
    value,
  }: {
    type: "language" | "timezone";
    value: string;
  }) => {
    setLangLoc((prev) => ({
      ...prev,
      [type]: value,
    }));
  };
  return (
    <section className="">
      <div className="grid-2 gap-3">
        <Dropdown>
          <Text.Paragraph>Language</Text.Paragraph>
          <Dropdown.Trigger className="flex items-center justify-between">
            {langLoc.language}
          </Dropdown.Trigger>

          <Dropdown.Content>
            {dummyLanguages.map((lng, i) => (
              <Dropdown.Item
                key={i}
                onClick={() => handleLangLoc({ type: "language", value: lng })}
                className={`${
                  langLoc.language === lng
                    ? "border border-primary-700 bg-primary-500/20"
                    : ""
                }`}
              >
                {lng}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
        <Dropdown>
          <Text.Paragraph>Timezone</Text.Paragraph>

          <Dropdown.Trigger className="flex items-center justify-between">
            {langLoc.timezone}
          </Dropdown.Trigger>

          <Dropdown.Content>
            {dummyTimeZones.map((tme, i) => (
              <Dropdown.Item
                key={i}
                onClick={() =>
                  handleLangLoc({
                    type: "timezone",
                    value: tme,
                  })
                }
                className={`${
                  langLoc.timezone === tme
                    ? "border border-primary-700 bg-primary-500/20"
                    : ""
                }`}
              >
                {tme}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </div>
    </section>
  );
};

export default LanguageLocalization;
