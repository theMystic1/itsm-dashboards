"use client";

import { Column, Radio, Row } from "@/components/user/create-ticket";
import { HeaderSettings } from ".";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import { priorityLevelSetting, SLATableDummy } from "@/constants/constant";
import { BiCheck, BiPlus, BiTrash } from "react-icons/bi";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import { useState } from "react";
import Modal from "@/components/ui/customModal";
import Dropdown from "@/components/ui/dropdown";
import { IoCloseCircleOutline } from "react-icons/io5";

const table_heading = [
  "Priority",
  "Response Time",
  "Resolution Time",
  "Notify On Breach",
  "Actions",
];

const SLAPolicies = () => {
  const [open, setOpen] = useState({
    edit: false,
    new: false,
    editData: null,
  });

  const [newPolicy, setNewPolicy] = useState({
    level: "",
    response: "",
    resolution: "",
    notifyOnBreach: false,
    id: 0,
  });

  const handleNewPolicy = ({
    variant,
    item,
  }: {
    variant: "level" | "response" | "resolution" | "notifyOnBreach";
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
              Priority Level
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.level || "Select level"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {priorityLevelSetting.map((prio) => (
                  <Dropdown.Item
                    key={prio.level}
                    className={`${
                      newPolicy.level.includes(prio.name)
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "level",
                        item: `${prio.name}  (${prio.level})`,
                      })
                    }
                  >
                    {prio.name} ({prio.level})
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Response time
            </Text.Paragraph>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Response time"
                className="text-input"
                value={newPolicy.response}
                onChange={(e) =>
                  handleNewPolicy({
                    variant: "response",
                    item: e.target.value,
                  })
                }
              />
            </div>
          </Column>
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Resolution time
            </Text.Paragraph>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Resolution time"
                className="text-input"
                value={newPolicy.resolution}
                onChange={(e) =>
                  handleNewPolicy({
                    variant: "resolution",
                    item: e.target.value,
                  })
                }
              />
            </div>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Notify On Breach
            </Text.Paragraph>
            <div className="flex items-center gap-20">
              <Radio
                label="On"
                selected={newPolicy.notifyOnBreach ? "On" : ""}
                onClick={() =>
                  handleNewPolicy({
                    variant: "notifyOnBreach",
                    item: true,
                  })
                }
              />
              <Radio
                label="Off"
                selected={newPolicy.notifyOnBreach ? "" : "Off"}
                onClick={() =>
                  handleNewPolicy({
                    variant: "notifyOnBreach",
                    item: false,
                  })
                }
              />
            </div>
          </Column>
          <Button>Add Policy</Button>
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
              Priority Level
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.level || "Select level"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {priorityLevelSetting.map((prio) => (
                  <Dropdown.Item
                    key={prio.level}
                    className={`${
                      newPolicy.level.includes(prio.name)
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "level",
                        item: `${prio.name}  (${prio.level})`,
                      })
                    }
                  >
                    {prio.name} ({prio.level})
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Response time
            </Text.Paragraph>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Response time"
                className="text-input"
                value={newPolicy.response}
                onChange={(e) =>
                  handleNewPolicy({
                    variant: "response",
                    item: e.target.value,
                  })
                }
              />
            </div>
          </Column>
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Resolution time
            </Text.Paragraph>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter Resolution time"
                className="text-input"
                value={newPolicy.resolution}
                onChange={(e) =>
                  handleNewPolicy({
                    variant: "resolution",
                    item: e.target.value,
                  })
                }
              />
            </div>
          </Column>

          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Notify On Breach
            </Text.Paragraph>
            <div className="flex items-center gap-20">
              <Radio
                label="On"
                selected={newPolicy.notifyOnBreach ? "On" : ""}
                onClick={() =>
                  handleNewPolicy({
                    variant: "notifyOnBreach",
                    item: true,
                  })
                }
              />
              <Radio
                label="Off"
                selected={newPolicy.notifyOnBreach ? "" : "Off"}
                onClick={() =>
                  handleNewPolicy({
                    variant: "notifyOnBreach",
                    item: false,
                  })
                }
              />
            </div>
          </Column>
          <Button>Add Policy</Button>
        </div>
      </Modal>
      <Column>
        <HeaderSettings
          header="SLA Targets by Priority Level"
          paragraph="Set the maximum resolution time for each priority level. Used to trigger SLA breach alerts and performance metrics."
        />

        <TableOverflow>
          <Table>
            <Tr className="border-b border-b-gray-200">
              {table_heading?.map((thd) => (
                <Th key={thd}>{thd}</Th>
              ))}
            </Tr>

            {SLATableDummy.map((sla) => (
              <Tr key={sla.id} className="border-b border-b-gray-200">
                <Td>{sla.name}</Td>
                <Td>{sla.responseTime}</Td>
                <Td>{sla.resolutionTime}</Td>
                <Td className=" gap-1">
                  <span className="flex items-center gap-2">
                    {sla.notifyOnBreach ? (
                      <Checkbox active={sla.notifyOnBreach} />
                    ) : (
                      <IoCloseCircleOutline color="#c90707" size={20} />
                    )}
                    <Text.SmallText>
                      {sla.notifyOnBreach ? "Yes" : "No"}
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
                        level: sla.name,
                        resolution: sla.resolutionTime,
                        response: sla.responseTime,
                        notifyOnBreach: sla.notifyOnBreach,
                        id: sla.id,
                      });
                    }}
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
              <Button.Text>Add Policy</Button.Text>
            </Button>
          </div>
        </TableOverflow>
      </Column>
    </section>
  );
};

export default SLAPolicies;

export const Checkbox = ({
  active,
  onCheck,
  disabled,
}: {
  active: boolean;
  onCheck?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`h-6 w-6  rounded-sm ${
        active ? "bg-primary-600 text-white" : "border border-gray-200"
      } flex items-center justify-center`}
      onClick={onCheck}
      disabled={disabled}
    >
      {active && <BiCheck size={20} />}
    </button>
  );
};
