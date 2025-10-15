"use client";

import { Column, Radio, Row } from "@/components/user/create-ticket";
import { HeaderSettings } from ".";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import { accessMatrix, priorityLevelSetting } from "@/constants/constant";
import { BiPlus, BiTrash } from "react-icons/bi";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import { useState } from "react";
import Modal from "@/components/ui/customModal";
import Dropdown from "@/components/ui/dropdown";
import { Checkbox } from "./SLA-policies";

const table_heading = ["Role", "Access Area", "Permissions", "Actions"];

const RolesPermissions = () => {
  const [open, setOpen] = useState({
    edit: false,
    new: false,
    editData: null,
  });

  const [newPolicy, setNewPolicy] = useState<{
    accessArea: string;
    role: string;
    permissions: string[];
    id: number;
  }>({
    role: "",
    accessArea: "",
    permissions: [],
    id: 0,
  });

  const handleNewPolicy = ({
    variant,
    item,
  }: {
    variant: "role" | "accessArea" | "permissions" | "notifyOnBreach";
    item: string | string[] | boolean;
  }) => {
    setNewPolicy((prev) => ({
      ...prev,
      [variant]: item,
    }));
  };

  const roles = [...new Set(accessMatrix.map((rol) => rol.Role))];
  const accessArea = [...new Set(accessMatrix.map((rol) => rol.AccessArea))];
  const perm = accessMatrix.map((rol) => rol.Permissions.join(", "));

  const permissions = [...new Set(perm.join(", ").split(" "))];
  // console.log(permissions);
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
            <Text.Paragraph className="text-sm font-bold">Role</Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.role || "Select level"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {roles.map((prio) => (
                  <Dropdown.Item
                    key={prio}
                    className={`${
                      newPolicy.role.includes(prio)
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "role",
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
              Access Area
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.accessArea || "Select Aaccess areas"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {accessArea.map((prio) => (
                  <Dropdown.Item
                    key={prio}
                    className={`${
                      newPolicy.accessArea.includes(prio)
                        ? "bg-primary-600 text-white  border border-prim-600"
                        : ""
                    } flex items-center gap-2`}
                    onClick={() => {
                      handleNewPolicy({
                        variant: "accessArea",
                        item: prio,
                      });
                    }}
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Permissions
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.permissions.join(" ") || "Select permissions"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {permissions.map((prio) => (
                  <Dropdown.Item
                    key={prio}
                    className={`${
                      newPolicy.permissions.includes(prio)
                        ? "bg-primary-100  border border-prim-600"
                        : ""
                    } flex items-center gap-2`}
                    onClick={() => {
                      const exists = newPolicy.permissions.includes(prio);
                      const selectedPermissions = exists
                        ? newPolicy.permissions.filter((p) => p !== prio)
                        : [...newPolicy.permissions, prio];
                      handleNewPolicy({
                        variant: "permissions",
                        item: selectedPermissions,
                      });
                    }}
                  >
                    <Checkbox
                      active={newPolicy.permissions.includes(prio)}
                      disabled
                    />
                    <p>{prio}</p>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Button>Add Role</Button>
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
            <Text.Paragraph className="text-sm font-bold">Role</Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.role || "Select level"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {roles.map((prio) => (
                  <Dropdown.Item
                    key={prio}
                    className={`${
                      newPolicy.role.includes(prio)
                        ? "bg-primary-600 text-white border border-prim-600"
                        : ""
                    }`}
                    onClick={() =>
                      handleNewPolicy({
                        variant: "role",
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
              Access Area
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.accessArea || "Select Aaccess areas"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {accessArea.map((prio) => (
                  <Dropdown.Item
                    key={prio}
                    className={`${
                      newPolicy.accessArea.includes(prio)
                        ? "bg-primary-600 text-white  border border-prim-600"
                        : ""
                    } flex items-center gap-2`}
                    onClick={() => {
                      handleNewPolicy({
                        variant: "accessArea",
                        item: prio,
                      });
                    }}
                  >
                    {prio}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>
          <Column>
            <Text.Paragraph className="text-sm font-bold">
              Permissions
            </Text.Paragraph>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {newPolicy.permissions.join(" ") || "Select permissions"}
              </Dropdown.Trigger>

              <Dropdown.Content>
                {permissions.map((prio) => (
                  <Dropdown.Item
                    key={prio}
                    className={`${
                      newPolicy.permissions.includes(prio)
                        ? "bg-primary-100  border border-prim-600"
                        : ""
                    } flex items-center gap-2`}
                    onClick={() => {
                      const exists = newPolicy.permissions.includes(prio);
                      const selectedPermissions = exists
                        ? newPolicy.permissions.filter((p) => p !== prio)
                        : [...newPolicy.permissions, prio];
                      handleNewPolicy({
                        variant: "permissions",
                        item: selectedPermissions,
                      });
                    }}
                  >
                    <Checkbox
                      active={newPolicy.permissions.includes(prio)}
                      disabled
                    />
                    <p>{prio}</p>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>

          <Button>Edit Role</Button>
        </div>
      </Modal>

      <Column>
        <HeaderSettings
          header="System Roles & Access Levels"
          paragraph="Configure access levels and permissions per role. Determines what each user can view or modify."
        />

        <TableOverflow>
          <Table>
            <Tr className="border-b border-b-gray-200">
              {table_heading?.map((thd) => (
                <Th key={thd}>{thd}</Th>
              ))}
            </Tr>

            {accessMatrix.map((sla, i) => (
              <Tr key={i} className="border-b border-b-gray-200">
                <Td>{sla.Role}</Td>
                <Td>{sla.AccessArea}</Td>
                <Td>{sla.Permissions.join(", ")}</Td>

                <Td className="flex items-center gap-1">
                  <Button
                    variant="secondary_2"
                    onClick={() => {
                      setOpen((prev) => ({
                        ...prev,
                        edit: true,
                      }));

                      setNewPolicy({
                        accessArea: sla.AccessArea,
                        permissions: sla.Permissions,
                        role: sla.Role,

                        id: 0,
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
              <Button.Text>Add Role</Button.Text>
            </Button>
          </div>
        </TableOverflow>
      </Column>
    </section>
  );
};

export default RolesPermissions;
