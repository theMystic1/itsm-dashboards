"use clien";

import { Column, Radio, Row } from "@/components/user/create-ticket";
import { HeaderSettings } from ".";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import { WorkFlowStageDummy } from "@/constants/constant";
import { BiCheck, BiPlus, BiTrash } from "react-icons/bi";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import { useState } from "react";
import Modal from "@/components/ui/customModal";
import Dropdown from "@/components/ui/dropdown";
import { Checkbox } from "./SLA-policies";
import { IoCloseCircleOutline } from "react-icons/io5";

const table_heading = [
  "Stage Order",
  "Name",
  "Editable",
  "Trigger's Notification",
  "Actions",
];

const WorkFlowStages = () => {
  const [open, setOpen] = useState({
    edit: false,
    new: false,
    editData: null,
  });

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    stageOrder: 0,
    editable: false,
    triggersNotif: false,
    id: 0,
  });

  const handleNewPolicy = ({
    variant,
    item,
  }: {
    variant: "name" | "stageOrder" | "editable" | "triggersNotif";
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
              Stage Order
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.stageOrder || "Select level"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((prio, i) => (
                  <Dropdown.Item
                    key={i}
                    // className={`${
                    //   newPolicy.level === prio
                    //     ? "bg-primary-600 text-white border border-prim-600"
                    //     : ""
                    // }`}
                    // onClick={() =>
                    //   handleNewPolicy({
                    //     variant: "level",
                    //     item: `${prio.name}  (${prio.level})`,
                    //   })
                    // }
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">Name</Text.Paragraph>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Work flow name"
                className="text-input"
                value={newPolicy.name}
                onChange={(e) =>
                  handleNewPolicy({
                    variant: "name",
                    item: e.target.value,
                  })
                }
              />
            </div>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Editble
            </Text.Paragraph>
            <div className="flex items-center gap-20">
              <Radio
                label="On"
                selected={newPolicy.editable ? "On" : ""}
                onClick={() =>
                  handleNewPolicy({
                    variant: "editable",
                    item: true,
                  })
                }
              />
              <Radio
                label="Off"
                selected={newPolicy.editable ? "" : "Off"}
                onClick={() =>
                  handleNewPolicy({
                    variant: "editable",
                    item: false,
                  })
                }
              />
            </div>
          </Column>
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Triggers Notification
            </Text.Paragraph>
            <div className="flex items-center gap-20">
              <Radio
                label="On"
                selected={newPolicy.triggersNotif ? "On" : ""}
                onClick={() =>
                  handleNewPolicy({
                    variant: "triggersNotif",
                    item: true,
                  })
                }
              />
              <Radio
                label="Off"
                selected={newPolicy.triggersNotif ? "" : "Off"}
                onClick={() =>
                  handleNewPolicy({
                    variant: "triggersNotif",
                    item: false,
                  })
                }
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
              Stage Order
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.stageOrder || "Select level"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((prio, i) => (
                  <Dropdown.Item
                    key={i}
                    // className={`${
                    //   newPolicy.level === prio
                    //     ? "bg-primary-600 text-white border border-prim-600"
                    //     : ""
                    // }`}
                    // onClick={() =>
                    //   handleNewPolicy({
                    //     variant: "level",
                    //     item: `${prio.name}  (${prio.level})`,
                    //   })
                    // }
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">Name</Text.Paragraph>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Work flow name"
                className="text-input"
                value={newPolicy.name}
                onChange={(e) =>
                  handleNewPolicy({
                    variant: "name",
                    item: e.target.value,
                  })
                }
              />
            </div>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Editble
            </Text.Paragraph>
            <div className="flex items-center gap-20">
              <Radio
                label="On"
                selected={newPolicy.editable ? "On" : ""}
                onClick={() =>
                  handleNewPolicy({
                    variant: "editable",
                    item: true,
                  })
                }
              />
              <Radio
                label="Off"
                selected={newPolicy.editable ? "" : "Off"}
                onClick={() =>
                  handleNewPolicy({
                    variant: "editable",
                    item: false,
                  })
                }
              />
            </div>
          </Column>
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Triggers Notification
            </Text.Paragraph>
            <div className="flex items-center gap-20">
              <Radio
                label="On"
                selected={newPolicy.triggersNotif ? "On" : ""}
                onClick={() =>
                  handleNewPolicy({
                    variant: "triggersNotif",
                    item: true,
                  })
                }
              />
              <Radio
                label="Off"
                selected={newPolicy.triggersNotif ? "" : "Off"}
                onClick={() =>
                  handleNewPolicy({
                    variant: "triggersNotif",
                    item: false,
                  })
                }
              />
            </div>
          </Column>
          <Button>Add Workflow stage</Button>
        </div>
      </Modal>

      <Column>
        <HeaderSettings
          header="Ticket Lifecycle Settings"
          paragraph="Define the stages through which a ticket progresses. Use this to track statuses and enable audit trails."
        />

        <TableOverflow>
          <Table>
            <Tr className="border-b border-b-gray-200">
              {table_heading?.map((thd) => (
                <Th key={thd}>{thd}</Th>
              ))}
            </Tr>

            {WorkFlowStageDummy.map((sla) => (
              <Tr key={sla.sn} className="border-b border-b-gray-200">
                <Td>{sla.sn}</Td>
                <Td>{sla.name}</Td>
                <Td>
                  <span className="flex items-center gap-2">
                    {sla.editable ? (
                      <Checkbox active={sla.editable} />
                    ) : (
                      <IoCloseCircleOutline color="#c90707" size={20} />
                    )}
                    <Text.SmallText>
                      {sla.editable ? "Yes" : "No"}
                    </Text.SmallText>
                  </span>
                </Td>
                <Td className=" gap-1">
                  <span className="flex items-center gap-2">
                    {sla.triggerNot ? (
                      <Checkbox active={sla.triggerNot} />
                    ) : (
                      <IoCloseCircleOutline color="#c90707" size={20} />
                    )}
                    <Text.SmallText>
                      {sla.triggerNot ? "Yes" : "No"}
                    </Text.SmallText>
                  </span>
                </Td>

                <Td className="flex items-center gap-1">
                  <Button
                    variant="secondary_2"
                    onClick={() => {
                      setOpen((prev) => ({
                        ...prev,
                        edit: true,
                      }));

                      setNewPolicy({
                        name: sla.name,
                        stageOrder: sla.sn,
                        editable: sla.editable,
                        triggersNotif: sla.triggerNot,
                        id: sla.sn,
                      });
                    }}
                    disabled={!sla.editable}
                    className={`${
                      sla.editable
                        ? "!border-gray-700"
                        : "text-gray-400 !border-gray-300 !cursor-not-allowed"
                    }`}
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
              <Button.Text>Add Workflow stage</Button.Text>
            </Button>
          </div>
        </TableOverflow>
      </Column>
    </section>
  );
};
export default WorkFlowStages;
