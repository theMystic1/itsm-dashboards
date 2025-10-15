"use client";
import { Column } from "@/components/user/create-ticket";
import { HeaderSettings } from ".";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import { integrations } from "@/constants/constant";
import { BiPlus, BiTrash } from "react-icons/bi";
import Text from "@/components/ui/text";
import Button from "@/components/ui/custom-btn";
import { useState } from "react";

import { Checkbox } from "./SLA-policies";
import { IoCloseCircleOutline } from "react-icons/io5";
import Modal from "@/components/ui/customModal";
import IntegrationForm from "@/components/ui/int-modal";

const table_heading = [
  "Tool",
  "Integration type",
  "Status",
  "Notes",
  "Actions",
];

const Integrations = () => {
  const [open, setOpen] = useState({
    new: false,
    edit: false,
  });
  return (
    <section>
      <Modal
        isOpen={open.new}
        onClose={() =>
          setOpen({
            new: false,
            edit: false,
          })
        }
      >
        <IntegrationForm
          onSubmit={(values) => {
            // persist to state/server
            console.log(values);
            setOpen({
              new: false,
              edit: false,
            });
          }}
          onCancel={() =>
            setOpen({
              new: false,
              edit: false,
            })
          }
        />
      </Modal>

      <Column>
        <HeaderSettings
          header="Platform Integrations"
          paragraph="Enable integrations to streamline communication and authentication."
        />

        <TableOverflow>
          <Table>
            <Tr className="border-b border-b-gray-200">
              {table_heading.map((thd) => (
                <Th key={thd}>{thd}</Th>
              ))}
            </Tr>

            {integrations.map((rule, i) => (
              <Tr key={`${i}-${i}`} className="border-b border-b-gray-200">
                <Td>{rule.tool}</Td>
                <Td>{rule.integrationType}</Td>

                <Td>
                  <span className="flex items-center gap-2">
                    {rule.status ? (
                      <Checkbox active={rule.status} disabled />
                    ) : (
                      <button disabled aria-label="Turn on rule">
                        <IoCloseCircleOutline color="#c90707" size={20} />
                      </button>
                    )}
                    <Text.SmallText>
                      {rule.status ? "On" : "Off"}
                    </Text.SmallText>
                  </span>
                </Td>
                <Td>{rule.Notes}</Td>
                <Td className="flex items-center gap-2">
                  <Button
                    variant="secondary_2"
                    // onClick={() =>
                    //   setOpen({ edit: true, new: false, editIndex: i })
                    // }
                  >
                    Edit
                  </Button>
                  <button
                    className="text-red-600"
                    // onClick={() => deleteRule(i)}
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
              onClick={() => setOpen({ edit: false, new: true })}
            >
              <Button.Icon>
                <BiPlus />
              </Button.Icon>
              <Button.Text>Add a Platform</Button.Text>
            </Button>
          </div>
        </TableOverflow>
      </Column>
    </section>
  );
};

export default Integrations;
