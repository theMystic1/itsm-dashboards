"use client";

import * as React from "react";
import { BiDotsVerticalRounded, BiTrash, BiPlus } from "react-icons/bi";
import Dropdown from "@/components/ui/dropdown"; // your Dropdown
import Button from "@/components/ui/custom-btn"; // your Button
import Text from "@/components/ui/text"; // optional typography
import { Checkbox } from "./SLA-policies";

// ---------- Types ----------
type Condition = {
  id: string;
  field: string; // e.g. "Category"
  operator: string; // e.g. "="
  value: string; // e.g. "Network"
};

type RuleForm = {
  ruleName: string;
  status: boolean;
  conditions: Condition[];
  assignTo: string;
  escalateAfterMins: string; // store as string for your "everything string" contract if needed later
  notify: string;
  fallbackAssignee: string;
};

type RoutingRuleFormProps = {
  initial?: Partial<RuleForm>;
  onSubmit?: (data: RuleForm) => void;
  onCancel?: () => void;
};

// ---------- Options (example lists; tweak to your data) ----------
const FIELD_OPTIONS = [
  "Category",
  "Location",
  "Department",
  "Priority",
  "Time of Day",
] as const;
const OP_OPTIONS = ["=", "!=", "in", "not in", ">", "<", "contains"] as const;

const VALUE_SUGGESTIONS: Record<string, string[]> = {
  Category: ["Network", "Hardware", "Authentication", "Security"],
  Location: ["Ontario", "Quebec", "Remote", "New York"],
  Department: ["Finance", "Support", "IT", "Engineering"],
  Priority: ["P1", "P2", "P3", "P4"],
  "Time of Day": ["09:00-17:00", "after-hours", "weekend"],
};

const ASSIGNEES = [
  "Networking Team",
  "On-Call Technician",
  "Ontario IT Desk",
  "SRE On-Call",
  "Identity Ops",
  "Current Assignee",
  "Backlog Triage",
  "Regional Support Manager",
] as const;
const NOTIFY_ROLES = [
  "Team Lead",
  "Duty Manager",
  "Incident Commander",
  "Service Owner",
  "CISO Delegate",
] as const;

// Utility
const uid = () => Math.random().toString(36).slice(2, 9);

// ---------- Component ----------
export default function RoutingRuleForm({
  initial,
  onSubmit,
  onCancel,
}: RoutingRuleFormProps) {
  const [form, setForm] = React.useState<RuleForm>(() => ({
    ruleName: initial?.ruleName ?? "",
    status: initial?.status ?? true,
    conditions: initial?.conditions ?? [
      { id: uid(), field: "Category", operator: "=", value: "Network" },
      { id: uid(), field: "Location", operator: "=", value: "Ontario" },
    ],
    assignTo: initial?.assignTo ?? "Networking Team",
    escalateAfterMins: initial?.escalateAfterMins ?? "60", // "1 hour"
    notify: initial?.notify ?? "Team Lead",
    fallbackAssignee: initial?.fallbackAssignee ?? "Regional Support Manager",
  }));

  // ------- Handlers -------
  const setField = <K extends keyof RuleForm>(key: K, value: RuleForm[K]) =>
    setForm((s) => ({ ...s, [key]: value }));

  const addCondition = () =>
    setForm((s) => ({
      ...s,
      conditions: [
        ...s.conditions,
        { id: uid(), field: "Category", operator: "=", value: "Network" },
      ],
    }));

  const removeCondition = (id: string) =>
    setForm((s) => ({
      ...s,
      conditions: s.conditions.filter((c) => c.id !== id),
    }));

  const patchCondition = (id: string, patch: Partial<Condition>) =>
    setForm((s) => ({
      ...s,
      conditions: s.conditions.map((c) =>
        c.id === id ? { ...c, ...patch } : c
      ),
    }));

  const submit = () => onSubmit?.(form);

  // For “Escalate After”: display helper like “1 hour”
  const escalateLabel =
    Number(form.escalateAfterMins) % 60 === 0
      ? `${Number(form.escalateAfterMins) / 60} hour${
          form.escalateAfterMins === "60" ? "" : "s"
        }`
      : `${form.escalateAfterMins} min`;

  return (
    <div className="w-full max-w-3xl">
      {/* Title row */}
      <div className="mb-4">
        <Text.SmallHeading className="text-base font-semibold">
          Edit Routing Rule
        </Text.SmallHeading>
      </div>

      {/* Rule Name */}
      <div className="mb-3">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Rule Name
        </label>
        <input
          value={form.ruleName}
          onChange={(e) => setField("ruleName", e.target.value)}
          placeholder="Network Routing"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500"
        />
      </div>

      {/* Rule Status */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Rule Status
        </label>
        <div className="flex items-center gap-2">
          <Checkbox
            active={form.status}
            onCheck={() => setField("status", !form.status)}
          />
          <span className="text-sm text-gray-700">
            {form.status ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Trigger Conditions */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Trigger Condition
        </label>

        <div className="flex flex-col gap-2">
          {form.conditions.map((c, idx) => (
            <div
              key={c.id}
              className="grid grid-cols-[28px_1fr_120px_1fr_36px] items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/60 p-2"
            >
              {/* Drag Handle (static visual) */}
              <div className="flex h-10 items-center justify-center text-gray-400">
                <BiDotsVerticalRounded />
              </div>

              {/* Field */}
              <Dropdown>
                <Dropdown.Trigger className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-2 text-sm">
                  {c.field || "Field"}
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {FIELD_OPTIONS.map((opt) => (
                    <Dropdown.Item
                      key={opt}
                      onClick={() => {
                        const defaultVal = VALUE_SUGGESTIONS[opt]?.[0] ?? "";
                        patchCondition(c.id, { field: opt, value: defaultVal });
                      }}
                      className={`${
                        c.field === opt ? "bg-primary-600 text-white" : ""
                      }`}
                    >
                      {opt}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown>

              {/* Operator */}
              <Dropdown>
                <Dropdown.Trigger className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-2 text-sm">
                  {c.operator || "Operator"}
                </Dropdown.Trigger>
                <Dropdown.Content>
                  {OP_OPTIONS.map((op) => (
                    <Dropdown.Item
                      key={op}
                      onClick={() => patchCondition(c.id, { operator: op })}
                      className={`${
                        c.operator === op ? "bg-primary-600 text-white" : ""
                      }`}
                    >
                      {op}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Content>
              </Dropdown>

              {/* Value (dropdown when suggestions exist; otherwise input) */}
              {VALUE_SUGGESTIONS[c.field]?.length ? (
                <Dropdown>
                  <Dropdown.Trigger className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-2 text-sm">
                    {c.value || "Select value"}
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    {VALUE_SUGGESTIONS[c.field].map((v) => (
                      <Dropdown.Item
                        key={v}
                        onClick={() => patchCondition(c.id, { value: v })}
                        className={`${
                          c.value === v ? "bg-primary-600 text-white" : ""
                        }`}
                      >
                        {v}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Content>
                </Dropdown>
              ) : (
                <input
                  value={c.value}
                  onChange={(e) =>
                    patchCondition(c.id, { value: e.target.value })
                  }
                  placeholder="Enter value"
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-2 text-sm outline-none focus:border-primary-500"
                />
              )}

              {/* Remove */}
              <button
                type="button"
                onClick={() => removeCondition(c.id)}
                className="flex h-10 w-9 items-center justify-center rounded-md border border-red-200 bg-white text-red-600 hover:bg-red-50"
                aria-label={`Remove condition ${idx + 1}`}
                title="Remove"
              >
                <BiTrash size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-2">
          <Button variant="secondary_2" onClick={addCondition}>
            <Button.Icon>
              <BiPlus />
            </Button.Icon>
            <Button.Text>Add Condition</Button.Text>
          </Button>
        </div>
      </div>

      {/* Assign To */}
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Assign To
        </label>
        <Dropdown className="w-full">
          <Dropdown.Trigger className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-2 text-sm">
            {form.assignTo || "Select assignee"}
          </Dropdown.Trigger>
          <Dropdown.Content>
            {ASSIGNEES.map((name) => (
              <Dropdown.Item
                key={name}
                onClick={() => setField("assignTo", name)}
                className={`${
                  form.assignTo === name ? "bg-primary-600 text-white" : ""
                }`}
              >
                {name}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </div>

      {/* Escalate After + Notify */}
      <div className="mb-4  grid grid-cols-2 gap-3  ">
        <div className="">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Escalate After
          </label>
          <div className="flex items-center gap-2 w-full">
            <div className="input-container">
              <input
                type="text"
                value={form.escalateAfterMins}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, "");
                  setField("escalateAfterMins", v);
                }}
                className="text-input"
                placeholder="Enter time frame"
              />
              {/* <span className="text-sm text-gray-600">mins</span> */}
            </div>
            {/* <span className="text-xs text-gray-400">({escalateLabel})</span> */}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Notify
          </label>
          <Dropdown className="w-full">
            <Dropdown.Trigger className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-2 text-sm">
              {form.notify || "Select role"}
            </Dropdown.Trigger>
            <Dropdown.Content>
              {NOTIFY_ROLES.map((role) => (
                <Dropdown.Item
                  key={role}
                  onClick={() => setField("notify", role)}
                  className={`${
                    form.notify === role ? "bg-primary-600 text-white" : ""
                  }`}
                >
                  {role}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </div>
      </div>

      {/* Fallback Assignee */}
      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Fallback Assignee
        </label>
        <Dropdown className="w-full">
          <Dropdown.Trigger className="flex h-10 items-center justify-between rounded-md border border-gray-200 bg-white px-2 text-sm">
            {form.fallbackAssignee || "Select fallback"}
          </Dropdown.Trigger>
          <Dropdown.Content>
            {ASSIGNEES.map((name) => (
              <Dropdown.Item
                key={name}
                onClick={() => setField("fallbackAssignee", name)}
                className={`${
                  form.fallbackAssignee === name
                    ? "bg-primary-600 text-white"
                    : ""
                }`}
              >
                {name}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="primary" onClick={submit} className="w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
