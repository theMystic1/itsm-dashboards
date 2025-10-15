"use client";

import { Column, Radio, Row } from "@/components/user/create-ticket";
import { HeaderSettings } from ".";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import {
  prioritiesTicketsDummy,
  WorkFlowStageDummy,
} from "@/constants/constant";
import { BiPlus, BiTrash } from "react-icons/bi";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import { useState } from "react";
import Modal from "@/components/ui/customModal";
import Dropdown from "@/components/ui/dropdown";

import StatusItem from "@/components/ui/status";

const table_heading = ["Priority", "Label", "Description", "Actions"];

const TicketPriorities = () => {
  const [open, setOpen] = useState({
    edit: false,
    new: false,
    editData: null,
  });

  const [newPolicy, setNewPolicy] = useState({
    Priority: "",
    Label: "",
    Description: "",
    // triggersNotif: false,
    id: 0,
  });

  const handleNewPolicy = ({
    variant,
    item,
  }: {
    variant: "Priority" | "Label" | "Description" | "triggersNotif";
    item: string | boolean;
  }) => {
    setNewPolicy((prev) => ({
      ...prev,
      [variant]: item,
    }));
  };
  return (
    <section className="h-full">
      <Modal
        onClose={() =>
          setOpen({
            new: false,
            edit: false,
            editData: null,
          })
        }
        isOpen={open.new}
        maxWidth="max-w-[400px]"
      >
        <div className="flex flex-col gap-6">
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Priority
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.Priority || "Select Priority"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {["P1", "P2", "P3", "P4"].map((prio, i) => (
                  <Dropdown.Item
                    key={i}
                    className={`${
                      newPolicy.Priority === prio
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "Priority",
                        item: prio,
                      })
                    }
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">Label</Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.Label || "Select Label"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {["Critical", "High", "Medium", "Low"].map((prio, i) => (
                  <Dropdown.Item
                    key={i}
                    className={`${
                      newPolicy.Label === prio
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "Label",
                        item: prio,
                      })
                    }
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Description
            </Text.Paragraph>
            <div className="input-container">
              <textarea
                rows={4}
                className="text-input"
                value={newPolicy.Description}
                onChange={(e) =>
                  handleNewPolicy({
                    item: e.target.value,
                    variant: "Description",
                  })
                }
                placeholder="Description"
              />
            </div>
          </Column>

          <Button>Add Workflow stage</Button>
        </div>
      </Modal>
      <Modal
        onClose={() =>
          setOpen({
            new: false,
            edit: false,
            editData: null,
          })
        }
        isOpen={open.edit}
        maxWidth="max-w-[400px]"
      >
        <div className="flex flex-col gap-6">
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Priority
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.Priority || "Select Priority"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {["P1", "P2", "P3", "P4"].map((prio, i) => (
                  <Dropdown.Item
                    key={i}
                    className={`${
                      newPolicy.Priority === prio
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "Priority",
                        item: prio,
                      })
                    }
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">Label</Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.Label || "Select Label"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {["Critical", "High", "Medium", "Low"].map((prio, i) => (
                  <Dropdown.Item
                    key={i}
                    className={`${
                      newPolicy.Label === prio
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "Label",
                        item: prio,
                      })
                    }
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Description
            </Text.Paragraph>
            <div className="input-container">
              <textarea
                rows={4}
                className="text-input"
                value={newPolicy.Description}
                onChange={(e) =>
                  handleNewPolicy({
                    item: e.target.value,
                    variant: "Description",
                  })
                }
                placeholder="Description"
              />
            </div>
          </Column>

          <Button>Add Workflow stage</Button>
        </div>
      </Modal>

      <Column>
        <HeaderSettings
          header="Priority Level Descriptions"
          paragraph="Customize how priorities are labeled and described across the platform."
        />

        <TableOverflow>
          <Table>
            <Tr className="border-b border-b-gray-200">
              {table_heading?.map((thd) => (
                <Th key={thd}>{thd}</Th>
              ))}
            </Tr>

            {prioritiesTicketsDummy.map((sla) => (
              <Tr key={sla.Priority} className="border-b border-b-gray-200">
                <Td>{sla.Priority}</Td>
                <Td>
                  <StatusItem
                    status={
                      sla.Label.toLowerCase() === "critical"
                        ? "danger"
                        : sla.Label.toLowerCase() === "high"
                        ? "resolved"
                        : sla.Label.toLowerCase() === "medium"
                        ? "progress"
                        : sla.Label.toLowerCase() === "low"
                        ? "open"
                        : "waiting"
                    }
                    name={sla.Label}
                  />
                </Td>

                <Td className=" gap-1">{sla.Description}</Td>

                <Td className="flex items-center gap-1">
                  <Button
                    variant="secondary_2"
                    onClick={() => {
                      setOpen((prev) => ({
                        ...prev,
                        edit: true,
                      }));

                      setNewPolicy({
                        Label: sla.Label,
                        Priority: sla.Priority,
                        Description: sla.Description,
                        id: 0,
                      });
                    }}
                    // disabled={!sla.editable}
                    // className={`${
                    //   sla.editable
                    //     ? "!border-gray-700"
                    //     : "text-gray-400 !border-gray-300 !cursor-not-allowed"
                    // }`}
                  >
                    Edit
                  </Button>
                  <button className="text-red-600">
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
                setOpen((prev) => ({
                  ...prev,
                  new: true,
                }))
              }
            >
              <Button.Icon>
                <BiPlus />
              </Button.Icon>
              <Button.Text>Add a priority Level</Button.Text>
            </Button>
          </div>
        </TableOverflow>
      </Column>
    </section>
  );
};

export default TicketPriorities;
