"use client";

import { Column, Radio } from "@/components/user/create-ticket";
import { HeaderSettings } from ".";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import { rulesById as initialRules } from "@/constants/constant";
import { BiPlus, BiTrash } from "react-icons/bi";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import { useMemo, useState } from "react";
import Modal from "@/components/ui/customModal";
import Dropdown from "@/components/ui/dropdown";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Checkbox } from "./SLA-policies";
import RoutingRuleForm from "./routing-modal";

// ⬅️ Import the form we built earlier
// import RoutingRuleForm from "@/components/settings/routing-rule-form";

/** Row shape used by the table (your array version) */
type RuleRow = {
  ruleName: string;
  triggerConditions: string; // single string e.g., "category = Network + location = Ontario"
  targetAssignment: string; // string
  escalation: string; // e.g., "60 min -> Incident Commander"
  status: boolean;
};

const table_heading = [
  "Rule Name",
  "Trigger Conditions",
  "Target Assignment",
  "Escalation",
  "Status",
  "Actions",
];

/* ---------- helpers: parse/format between table strings and form shape ---------- */

type Condition = { id: string; field: string; operator: string; value: string };
const uid = () => Math.random().toString(36).slice(2, 9);

/** Parse "field op value + field op value" into Condition[] */
function parseConditionsString(input: string): Condition[] {
  if (!input?.trim()) return [];
  // Split on + with optional spaces
  const parts = input.split(/\s*\+\s*/g);
  const ops = [
    "!=",
    "=",
    ">=",
    "<=",
    ">",
    "<",
    " in ",
    " not in ",
    " contains ",
  ];

  return parts.map((chunk) => {
    // Try to find operator by regex
    // Priority operators containing spaces first
    const spaced =
      /(.*?)(\s+in\s+|\s+not in\s+|\s+contains\s+|!=|>=|<=|=|>|<)(.*)/i.exec(
        chunk.trim()
      );
    if (spaced) {
      const field = spaced[1].trim();
      const operator = spaced[2].trim();
      const value = spaced[3].trim().replace(/^["“']|["”']$/g, "");
      return { id: uid(), field, operator, value };
    }
    // Fallback naive split by equals
    const eq = chunk.split("=");
    if (eq.length === 2) {
      return {
        id: uid(),
        field: eq[0].trim(),
        operator: "=",
        value: eq[1].trim(),
      };
    }
    // Last resort: treat whole thing as value with unknown op
    return { id: uid(), field: "field", operator: "=", value: chunk.trim() };
  });
}

/** Join Condition[] back to "field op value + ..." */
function formatConditions(conds: Condition[]): string {
  return conds.map((c) => `${c.field} ${c.operator} ${c.value}`).join(" + ");
}

/** Extract minutes from escalation like "120 min -> Manager" or "1 hour" */
function parseEscalationMinutes(escalation: string): string {
  if (!escalation) return "60";
  const m = escalation.match(
    /(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|minute|minutes|min|m)\b/i
  );
  if (!m) return "60";
  const n = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (unit.startsWith("hour") || unit.startsWith("hr"))
    return String(Math.round(n * 60));
  return String(Math.round(n));
}

/** Extract "notify" target text after arrow if present */
function parseNotify(escalation: string): string {
  const arrow = escalation.split("->");
  return arrow[1]?.trim() || "Team Lead";
}

/** Build escalation string from minutes + notify text */
function buildEscalation(mins: string, notify: string) {
  const m = Number(mins || "0");
  const label =
    m % 60 === 0 ? `${m / 60} ${m === 60 ? "hour" : "hours"}` : `${m} min`;
  return `${label} -> ${notify}`;
}

const RoutingRules = () => {
  // seed table data from constants
  const [rows, setRows] = useState<RuleRow[]>([...initialRules]);

  const [open, setOpen] = useState<{
    edit: boolean;
    new: boolean;
    editIndex: number | null;
  }>({
    edit: false,
    new: false,
    editIndex: null,
  });

  const closeAll = () => setOpen({ edit: false, new: false, editIndex: null });

  const toggleStatus = (index: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, status: !r.status } : r))
    );
  };

  const deleteRule = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  // ----- handlers to receive the form output -----

  type RuleForm = {
    ruleName: string;
    status: boolean;
    conditions: Condition[];
    assignTo: string;
    escalateAfterMins: string; // string
    notify: string;
    fallbackAssignee: string;
  };

  // Add new
  const handleCreate = (data: RuleForm) => {
    const next: RuleRow = {
      ruleName: data.ruleName,
      triggerConditions: formatConditions(data.conditions),
      targetAssignment: data.assignTo,
      escalation: buildEscalation(data.escalateAfterMins, data.notify),
      status: data.status,
    };
    setRows((prev) => [...prev, next]);
    closeAll();
  };

  // Edit existing
  const handleUpdate = (data: RuleForm) => {
    if (open.editIndex == null) return;
    const next: RuleRow = {
      ruleName: data.ruleName,
      triggerConditions: formatConditions(data.conditions),
      targetAssignment: data.assignTo,
      escalation: buildEscalation(data.escalateAfterMins, data.notify),
      status: data.status,
    };
    setRows((prev) => prev.map((r, i) => (i === open.editIndex ? next : r)));
    closeAll();
  };

  // Prefill for edit
  const editInitial = useMemo(() => {
    if (open.editIndex == null) return undefined;
    const r = rows[open.editIndex];
    return {
      ruleName: r.ruleName,
      status: r.status,
      conditions: parseConditionsString(r.triggerConditions),
      assignTo: r.targetAssignment,
      escalateAfterMins: parseEscalationMinutes(r.escalation),
      notify: parseNotify(r.escalation),
      fallbackAssignee: "Regional Support Manager",
    } as RuleForm;
  }, [open.editIndex, rows]);

  return (
    <section className="h-full">
      {/* NEW Rule Modal with embedded form */}
      <Modal isOpen={open.new} onClose={closeAll} maxWidth="max-w-[760px]">
        <RoutingRuleForm
          onSubmit={handleCreate}
          onCancel={closeAll}
          // no initial -> defaults inside the form
        />
      </Modal>

      {/* EDIT Rule Modal with embedded form (prefilled) */}
      <Modal isOpen={open.edit} onClose={closeAll} maxWidth="max-w-[760px]">
        <RoutingRuleForm
          initial={editInitial}
          onSubmit={handleUpdate}
          onCancel={closeAll}
        />
      </Modal>

      {/* Table */}
      <Column>
        <HeaderSettings
          header="Routing & Configuration Guidelines"
          paragraph="Configure routing rules to optimize workflows and enhance user interactions."
        />

        <TableOverflow>
          <Table>
            <Tr className="border-b border-b-gray-200">
              {table_heading.map((thd) => (
                <Th key={thd}>{thd}</Th>
              ))}
            </Tr>

            {rows.map((rule, i) => (
              <Tr
                key={`${rule.ruleName}-${i}`}
                className="border-b border-b-gray-200"
              >
                <Td>{rule.ruleName}</Td>
                <Td>{rule.triggerConditions}</Td>
                <Td>{rule.targetAssignment}</Td>
                <Td>{rule.escalation}</Td>

                <Td>
                  <span className="flex items-center gap-2">
                    {rule.status ? (
                      <Checkbox active={true} onCheck={() => toggleStatus(i)} />
                    ) : (
                      <button
                        onClick={() => toggleStatus(i)}
                        aria-label="Turn on rule"
                      >
                        <IoCloseCircleOutline color="#c90707" size={20} />
                      </button>
                    )}
                    <Text.SmallText>
                      {rule.status ? "On" : "Off"}
                    </Text.SmallText>
                  </span>
                </Td>

                <Td className="flex items-center gap-2">
                  <Button
                    variant="secondary_2"
                    onClick={() =>
                      setOpen({ edit: true, new: false, editIndex: i })
                    }
                  >
                    Edit
                  </Button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteRule(i)}
                    aria-label="Delete rule"
                    title="Delete"
                  >
                    <BiTrash size={20} />
                  </button>
                </Td>
              </Tr>
            ))}
          </Table>

          <div className="mt-4">
            <Button
              variant="secondary_2"
              onClick={() =>
                setOpen({ edit: false, new: true, editIndex: null })
              }
            >
              <Button.Icon>
                <BiPlus />
              </Button.Icon>
              <Button.Text>Add Routing rule</Button.Text>
            </Button>
          </div>
        </TableOverflow>
      </Column>
    </section>
  );
};

export default RoutingRules;
