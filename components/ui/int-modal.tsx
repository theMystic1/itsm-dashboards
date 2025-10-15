"use client";

import * as React from "react";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import Dropdown from "@/components/ui/dropdown";
import { ToggleBtn } from "../user/settings/notif-pref";

type IntegrationFormValues = {
  name: string;
  platformType: string;
  description: string;
  url: string;
  token: string;
  enabled: boolean;
};

type IntegrationFormProps = {
  initial?: Partial<IntegrationFormValues>;
  onSubmit?: (values: IntegrationFormValues) => void;
  onCancel?: () => void;
};

const PLATFORM_TYPES = [
  "Messaging",
  "Email (SMTP)",
  "SSO / LDAP",
  "Asset Tracker",
  "Monitoring",
  "ITSM",
  "Webhook",
] as const;

export default function IntegrationForm({
  initial,
  onSubmit,
  onCancel,
}: IntegrationFormProps) {
  const [v, setV] = React.useState<IntegrationFormValues>({
    name: initial?.name ?? "",
    platformType: initial?.platformType ?? "",
    description: initial?.description ?? "",
    url: initial?.url ?? "",
    token: initial?.token ?? "",
    enabled: initial?.enabled ?? true,
  });

  const [showToken, setShowToken] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const set = <K extends keyof IntegrationFormValues>(
    k: K,
    val: IntegrationFormValues[K]
  ) => setV((s) => ({ ...s, [k]: val }));

  // simple validation
  const urlOk = !v.url || /^https?:\/\/[^\s]+$/i.test(v.url);
  const nameOk = v.name.trim().length > 0;
  const platformOk = v.platformType.trim().length > 0;
  const canSubmit = nameOk && platformOk && urlOk;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    onSubmit?.(v);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-5">
        <Text.SmallHeading className="text-base font-semibold">
          New Integration
        </Text.SmallHeading>
      </div>

      {/* Integration Name */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Integration Name
        </label>
        <input
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 ${
            touched && !nameOk ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Slack"
          value={v.name}
          onChange={(e) => set("name", e.target.value)}
        />
        {touched && !nameOk && (
          <p className="mt-1 text-xs text-red-600">Name is required.</p>
        )}
      </div>

      {/* Platform Type */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Platform Type
        </label>
        <Dropdown className="w-full">
          <Dropdown.Trigger
            className={`flex h-10 items-center justify-between rounded-md border px-2 text-sm ${
              touched && !platformOk ? "border-red-300" : "border-gray-300"
            }`}
          >
            {v.platformType || "Select platform"}
          </Dropdown.Trigger>
          <Dropdown.Content>
            {PLATFORM_TYPES.map((p) => (
              <Dropdown.Item
                key={p}
                className={`${
                  v.platformType === p ? "bg-primary-600 text-white" : ""
                }`}
                onClick={() => set("platformType", p)}
              >
                {p}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
        {touched && !platformOk && (
          <p className="mt-1 text-xs text-red-600">
            Platform type is required.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={3}
          className="w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500"
          placeholder="Send alerts to the #it-incidents Slack channel."
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      {/* Integration URL */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Integration URL
        </label>
        <input
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 ${
            touched && !urlOk ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="https://hooks.slack.com/services/..."
          value={v.url}
          onChange={(e) => set("url", e.target.value)}
        />
        {touched && !urlOk && (
          <p className="mt-1 text-xs text-red-600">
            Enter a valid http(s) URL.
          </p>
        )}
      </div>

      {/* API Key/Token */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          API Key/Token
        </label>
        <div className="flex items-center gap-2">
          <input
            type={showToken ? "text" : "password"}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500"
            placeholder="••••••••••"
            value={v.token}
            onChange={(e) => set("token", e.target.value)}
            autoComplete="off"
          />
          <Button variant="secondary_2" onClick={() => setShowToken((s) => !s)}>
            {showToken ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      {/* Enable Integration */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Enable Integration
        </label>
        <div className="flex items-center gap-3">
          <ToggleBtn
            toggle={v.enabled}
            onClick={() => set("enabled", !v.enabled)}
          />
          <span className="text-sm text-gray-700">
            {v.enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-end gap-2">
        <Button
          variant="primary"
          className="w-full"
          onClick={submit}
          disabled={!canSubmit}
        >
          Add New Integration
        </Button>
      </div>
    </div>
  );
}
