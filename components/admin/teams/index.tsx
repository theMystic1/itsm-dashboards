"use client";

import Button from "@/components/ui/custom-btn";
import Dropdown from "@/components/ui/dropdown";
import { Table, TableOverflow, Td, Th, Tr } from "@/components/ui/table";
import Text from "@/components/ui/text";
import TogleSlide, { useSyncedSlide } from "@/components/ui/toggle-slide";
import UserProffileHeader from "@/components/ui/user-profile";
import { LayoutHeader } from "@/components/user/tickets/tickets";
import { teamsDummy, teamsDummyFilter, teamsStats } from "@/constants/constant";
import Image, { StaticImageData } from "next/image";
import { BiEdit, BiMenu, BiSearch } from "react-icons/bi";
import { MdAdd } from "react-icons/md";
import { Checkbox } from "../settings/SLA-policies";
import { IoCloseCircleOutline } from "react-icons/io5";
import { formatDateProper, formatTo12Hour } from "@/lib/helpers";
import { PiHamburger } from "react-icons/pi";
import { LuEllipsisVertical } from "react-icons/lu";
import { Column, Row } from "@/components/user/create-ticket";
import Modal from "@/components/ui/customModal";
import { ReactNode, useEffect, useState } from "react";
import ConfirmModal, {
  LoadingModal,
  SuccessModal,
} from "@/components/ui/confirm-modal";
import DropdownMenu, { MenuItem } from "@/components/ui/table-dropdown";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";

const TeamsPage = () => {
  const slides = ["Teams", "Users"];
  const [open, setOpen] = useState(false);
  const { activeSlide, setSlide } = useSyncedSlide(slides, "Teams", "toggle");
  const { roles, status, department } = teamsDummyFilter;
  const [dataToRender, setDataToRender] = useState<any[]>([]);
  const { users } = teamsStats;

  const [openOtherModals, setOpenOtherModals] = useState({
    loading: false,
    confirm: false,
    rightPortal: false,
    successModal: false,
    deactivate: false,
    reset: false,
  });
  const [edit, setEdit] = useState<{
    isEdit: boolean;
    editData: any;
  }>({
    isEdit: false,
    editData: null,
  });

  const [openDeactivate, setOpenDeactivate] = useState<{
    open: boolean;
    reassignedUser: any;
    reason: string;
  }>({
    open: false,
    reassignedUser: null,
    reason: "",
  });

  const [view, setView] = useState<{
    open: boolean;
    editData: any;
  }>({
    open: false,
    editData: null,
  });

  useEffect(() => {
    if (!openOtherModals.loading) return;

    const t = setTimeout(() => {
      setOpenOtherModals((prev) => ({
        ...prev,
        loading: false,
        successModal: true,
      }));
    }, 1000);

    return () => clearTimeout(t);
  }, [openOtherModals.loading]);

  const { tableData, table_heading, tabs, teamsTabData, teams_tabH } =
    teamsDummy;
  const { activeSlide: activeTableSlide, setSlide: setTableSlide } =
    useSyncedSlide(slides, tabs[0], "table_slide");

  useEffect(() => {
    const lowercaseSlide = activeTableSlide.toLowerCase();

    console.log(lowercaseSlide);
    if (lowercaseSlide === "all") {
      setDataToRender(tableData);
      return;
    }
    const filteredData = tableData.filter((td) => {
      // if (lowercaseSlide === "all") return;
      console.log(td.role);

      return (
        lowercaseSlide.includes(td.department.toLowerCase()) ||
        lowercaseSlide.includes(td.role.toLowerCase()) ||
        lowercaseSlide === td.status.toLowerCase() ||
        lowercaseSlide.includes(td.department.toLowerCase())
      );
    });

    setDataToRender(filteredData);
  }, [activeTableSlide, tableData]);

  const items: MenuItem[] = [
    {
      key: "edit",
      label: <Text.Paragraph className="text-sm">Edit</Text.Paragraph>,
      onSelect: () => setOpen(true),
    },

    {
      key: "deactivate",
      label: <Text.Paragraph className="text-sm">Deactivate</Text.Paragraph>,

      // danger: true,
      onSelect: () => {
        setOpenDeactivate((pre) => ({
          ...pre,
          open: true,
        }));
      },
    },
  ];

  // console.log(edit.editData, edit.isEdit);
  return (
    <main className="flex flex-col gap-5 min-h-screen">
      <Modal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEdit({
            editData: null,
            isEdit: false,
          });
        }}
      >
        <UserModal
          onClose={() => setOpen(false)}
          onConfirm={() => {
            setOpenOtherModals((prv) => ({
              ...prv,
              confirm: true,
            }));
            setOpen(false);
          }}
          type={edit.isEdit ? "edit" : "new"}
          editData={edit.editData}
        />
      </Modal>
      <Modal
        isOpen={openOtherModals.loading}
        onClose={() =>
          setOpenOtherModals((prev) => ({ ...prev, loading: false }))
        }
        maxWidth="max-w-sm"
      >
        <LoadingModal
          title={
            openOtherModals.deactivate
              ? "Deactivating..."
              : "Submitting Request"
          }
          description="Please wait a moment"
        />
      </Modal>

      <Modal
        isOpen={openOtherModals.confirm}
        maxWidth="max-w-sm"
        onClose={() =>
          setOpenOtherModals((prev) => ({
            ...prev,
            confirm: false,
            reset: false,
          }))
        }
      >
        <ConfirmModal
          title={
            openOtherModals.reset
              ? "Confirm Password reset?"
              : "Confirm Create User"
          }
          description={
            openOtherModals.reset
              ? "This action will reset the users password"
              : "This action will Create a new user"
          }
          confirmBtn="Yes, Proceed"
          cancelBtn="No, go back"
          onConfirm={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              confirm: false,
              loading: true,
            }));
          }}
          onCancel={() => {
            if (openOtherModals.reset) {
              setView((prev) => ({
                ...prev,
                open: true,
              }));
              setOpenOtherModals((prev) => ({
                ...prev,
                confirm: false,
              }));

              return;
            }

            setOpenOtherModals((prev) => ({ ...prev, confirm: false }));
            setOpen(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={openDeactivate.open}
        onClose={() =>
          setOpenDeactivate({
            open: true,
            reassignedUser: null,
            reason: "",
          })
        }
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col gap-4">
          <ConfirmModal
            title={"Confirm Deactivation"}
            description="This will revoke access and pause all assignments"
          />

          <Column>
            <Text.SmallHeading className="text-sm font-bold">
              Reassign ticket to
            </Text.SmallHeading>
            <Dropdown>
              <Dropdown.Trigger className="flex items-center justify-between">
                {openDeactivate?.reassignedUser?.name || "Reassign user"}
              </Dropdown.Trigger>
              <Dropdown.Content>
                {tableData.map((usr, i) => (
                  <Dropdown.Item className="" key={i}>
                    {usr.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Column>
          <Column>
            <Text.SmallHeading className="text-sm font-bold">
              Reason
            </Text.SmallHeading>
            <div className="input-container">
              <input
                type="text"
                className="text-input"
                placeholder="Enter reason for deactivation"
              />
            </div>
          </Column>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="secondary_2"
              className="w-full"
              onClick={() => {
                setOpenDeactivate({
                  reason: "",
                  reassignedUser: null,
                  open: false,
                });

                setOpenOtherModals((ptrv) => ({ ...ptrv, deactivate: false }));
              }}
            >
              No, Cancel
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setOpenOtherModals((ptrv) => ({
                  ...ptrv,
                  deactivate: true,
                  loading: true,
                }));

                setOpenDeactivate((pre) => ({
                  ...pre,
                  open: false,
                }));
              }}
            >
              Yes, Confirm
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={openOtherModals.successModal}
        maxWidth="max-w-sm"
        onClose={() =>
          setOpenOtherModals((prev) => ({
            ...prev,
            successModal: false,
            reset: false,
          }))
        }
      >
        <SuccessModal
          title={
            openOtherModals.deactivate
              ? "User deactivated successfully"
              : openOtherModals.reset
              ? "Password reset successful"
              : "User Created successfully"
          }
          description={
            openOtherModals.deactivate
              ? "We've deactivated this user, you can reactivate this user in the user management settings"
              : openOtherModals.reset
              ? "You have successfully reset password"
              : "You Created a new user successfully"
          }
          confirmBtn="Okay"
          onConfirm={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              successModal: false,
              rightPortal: false,
              deactivate: false,
              reset: false,
            }));
          }}
        />
      </Modal>

      <Modal
        isOpen={view.open}
        onClose={() =>
          setView((prev) => ({
            ...prev,
            open: false,
            editData: null,
          }))
        }
      >
        <UserItemModal
          onEdit={() => {
            setEdit({
              isEdit: true,
              editData: view.editData,
            });

            setOpen(true);
            setView((prev) => ({
              ...prev,
              open: false,
            }));
          }}
          onDeactivate={() => {
            setOpenDeactivate((prv) => ({ ...prv, open: true }));
            setView((prev) => ({
              ...prev,
              open: false,
            }));
          }}
          editData={view.editData}
          onReset={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              reset: true,
              confirm: true,
            }));

            setEdit((pr) => ({
              ...pr,
              isEdit: false,
            }));
            setView((prev) => ({
              ...prev,
              open: false,
            }));
            setOpen(false);
          }}
        />
      </Modal>
      <nav className="white-bg flex items-center justify-between">
        <div className="input-container flex items-center gap-2 max-w-[400px]">
          <BiSearch size={20} color="#1f1919" />
          <input
            type="text"
            className="text-input"
            placeholder="Search for users, settings,etc..."
          />
        </div>

        <UserProffileHeader textColor="" />
      </nav>

      <section className="white-bg flex-1 flex flex-col gap-5">
        <LayoutHeader title="User Management">
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              Department
            </Dropdown.Trigger>
            <Dropdown.Content>
              {department.map((dt, i) => (
                <Dropdown.Item className="" key={i}>
                  {dt}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown className="min-w-[128px]">
            <Dropdown.Trigger className="flex items-center justify-between">
              Status
            </Dropdown.Trigger>
            <Dropdown.Content>
              {status.map((dt, i) => (
                <Dropdown.Item className="" key={i}>
                  {dt}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Dropdown className="min-w-[128px]">
            <Dropdown.Trigger className="flex items-center justify-between">
              Roles
            </Dropdown.Trigger>
            <Dropdown.Content>
              {roles.map((dt, i) => (
                <Dropdown.Item className="" key={i}>
                  {dt}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
          <Button
            onClick={() => {
              setOpen(true);
            }}
          >
            <Button.Icon>
              <MdAdd size={24} />
            </Button.Icon>
            <Button.Text>Add new user</Button.Text>
          </Button>
        </LayoutHeader>

        <TogleSlide
          slides={slides}
          activeSlide={activeSlide}
          onSlideChange={setSlide}
        />
        {activeSlide.toLowerCase().includes("user") ? (
          <>
            <div className="grid grid-cols-3 gap-3 mt-5 min-h-[148px]">
              {users.map((usr, i: number) => {
                const { Icon } = usr;
                return (
                  <div
                    key={i}
                    className="tech-container flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <Text.SmallHeading>{usr.value}</Text.SmallHeading>
                      <Text.Paragraph className="text-xs text-gray-400">
                        {usr.name}
                      </Text.Paragraph>
                    </div>

                    <div
                      className={`h-8 w-8 rounded-full ${
                        usr.name.toLowerCase().includes("inactive")
                          ? "bg-red-300/20 text-red-500"
                          : " bg-primary-500/20 text-primary-500"
                      }  flex items-center justify-center text-xl`}
                    >
                      <Icon />
                    </div>
                  </div>
                );
              })}
            </div>

            <TogleSlide
              slides={tabs}
              activeSlide={activeTableSlide}
              onSlideChange={setTableSlide}
              paramKey="table_slide"
            />

            <TableOverflow>
              <Table>
                <Tr className="border-b border-b-gray-200">
                  {table_heading?.map((thd) => (
                    <Th key={thd}>{thd}</Th>
                  ))}
                </Tr>

                {dataToRender.map((sla) => (
                  <Tr
                    key={sla.id}
                    className="border-b border-b-gray-200 cursor-pointer "
                    onClick={() =>
                      setView({
                        open: true,
                        editData: {
                          ...sla,
                          tempPassword: "jdhjuec",
                          email: "bassey.basse@mail.ru",
                        },
                      })
                    }
                  >
                    <Td>
                      <span className="flex items-center gap-2">
                        <Image
                          src={sla.image}
                          height={16}
                          width={16}
                          alt="User image"
                          className="rounded-full object-cover"
                        />
                        <p>{sla.name}</p>
                      </span>
                    </Td>
                    <Td>{sla.role}</Td>
                    <Td>{sla.department}</Td>
                    <Td>
                      <span className="flex items-center gap-2">
                        {sla.status === "active" ? (
                          <Checkbox active={sla.status === "active"} />
                        ) : (
                          <IoCloseCircleOutline color="#c90707" size={20} />
                        )}
                        <Text.SmallText className="capitalize">
                          {sla.status}
                        </Text.SmallText>
                      </span>
                    </Td>
                    <Td>
                      {sla.ticketsAssigned > 0 ? sla.ticketsAssigned : " - "}
                    </Td>
                    <Td>{`${formatDateProper(sla.lastLogin)}, ${formatTo12Hour(
                      sla.lastLogin
                    )}`}</Td>

                    <Td
                      onClick={() => {
                        console.log("clicked");
                        setEdit({
                          isEdit: true,
                          editData: {
                            ...sla,
                            tempPassword: "jdhjuec",
                            email: "bassey.basse@mail.ru",
                          },
                        });
                      }}
                    >
                      <DropdownMenu
                        trigger={
                          <button className="w-10 h-8 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center">
                            <LuEllipsisVertical />
                          </button>
                        }
                        items={items}
                        align="end"
                        sideOffset={6}
                      />
                    </Td>
                  </Tr>
                ))}
              </Table>
            </TableOverflow>
          </>
        ) : (
          <TableOverflow>
            <Table>
              <Tr className="border-b border-b-gray-200">
                {teams_tabH?.map((thd) => (
                  <Th key={thd}>{thd}</Th>
                ))}
              </Tr>

              {teamsTabData.map((sla) => (
                <Tr
                  key={sla.id}
                  className="border-b border-b-gray-200 cursor-pointer "
                  onClick={() =>
                    setView({
                      open: true,
                      editData: {
                        ...sla,
                        tempPassword: "jdhjuec",
                        email: "bassey.basse@mail.ru",
                      },
                    })
                  }
                >
                  <Td>{sla.name}</Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      <Image
                        src={sla.teamLead.image}
                        height={16}
                        width={16}
                        alt="User image"
                        className="rounded-full object-cover"
                      />
                      <p>{sla.teamLead.name}</p>
                    </span>
                  </Td>

                  <Td>{sla.members}</Td>
                  <Td>
                    <span className="flex items-center gap-2">
                      {sla.status === "active" ? (
                        <Checkbox active={sla.status === "active"} />
                      ) : (
                        <IoCloseCircleOutline color="#c90707" size={20} />
                      )}
                      <Text.SmallText className="capitalize">
                        {sla.status}
                      </Text.SmallText>
                    </span>
                  </Td>

                  <Td
                    onClick={() => {
                      console.log("clicked");
                      setEdit({
                        isEdit: true,
                        editData: {
                          ...sla,
                          tempPassword: "jdhjuec",
                          email: "bassey.basse@mail.ru",
                        },
                      });
                    }}
                  >
                    <DropdownMenu
                      trigger={
                        <button className="w-10 h-8 rounded-md bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center">
                          <LuEllipsisVertical />
                        </button>
                      }
                      items={items}
                      align="end"
                      sideOffset={6}
                    />
                  </Td>
                </Tr>
              ))}
            </Table>
          </TableOverflow>
        )}
      </section>
    </main>
  );
};

export default TeamsPage;

const UserItemModal = ({
  onReset,
  onDeactivate,
  onEdit,
  editData,
}: {
  onEdit?: () => void;
  onReset?: () => void;
  onDeactivate?: () => void;
  editData: {
    name: string;
    email: string;
    role: string;
    reason: string;
    tempPassword: string;
    department: string;
    ticketsAssigned: number;
    status: string;
    lastLogin: Date;
    image: StaticImageData;
    id: number;
  };
}) => {
  console.log(editData);
  return (
    <div className="flex flex-col gap-4">
      <div className="py-2 flex items-center justify-center border-b border-b-gray-300">
        <Text.Paragraph>{editData?.name}</Text.Paragraph>
      </div>

      <Image
        src={editData?.image}
        height={90}
        width={90}
        alt="User image"
        className="rounded-full object-cover"
      />

      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Full Name:
        </Text.SmallHeading>
        <Text.Paragraph className=" !text-sm">{editData.name}</Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Role:
        </Text.SmallHeading>
        <Text.Paragraph className="!text-sm">{editData.role}</Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Department:
        </Text.SmallHeading>
        <Text.Paragraph className="!text-sm">
          {editData.department}
        </Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Email:
        </Text.SmallHeading>
        <Text.Paragraph className="!text-sm">{editData.email}</Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Account status:
        </Text.SmallHeading>
        <div className="flex items-center gap-1">
          {editData?.status?.toLowerCase() === "active" ? (
            <Checkbox active />
          ) : (
            <IoCloseCircleOutline color="#c90707" size={20} />
          )}
          <Text.Paragraph className=" !text-sm capitalize">
            {editData.status}
          </Text.Paragraph>
        </div>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Tickets Assigned:
        </Text.SmallHeading>
        <Text.Paragraph className=" !text-sm">
          {editData.ticketsAssigned}
        </Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          SLA Compliance:
        </Text.SmallHeading>
        <Text.Paragraph className=" !text-sm">93%</Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Avg MTTR:
        </Text.SmallHeading>
        <Text.Paragraph className=" !text-sm">2h 58m</Text.Paragraph>
      </RowGrid>
      <RowGrid>
        <Text.SmallHeading className="!font-bold !text-sm">
          Last login:
        </Text.SmallHeading>
        <Text.Paragraph className=" !text-sm">
          {`${formatDateProper(editData.lastLogin)}, ${formatTo12Hour(
            editData.lastLogin
          )}`}
        </Text.Paragraph>
      </RowGrid>

      <div className="border-t border-t-gray-300 py-2 grid grid-cols-3 gap-2">
        <Button variant="secondary_2" onClick={onEdit}>
          <Button.Icon>
            <HiOutlinePencilAlt size={20} />
          </Button.Icon>
          <Button.Text>Edit</Button.Text>
        </Button>
        <Button variant="secondary_2" onClick={onReset}>
          <Button.Icon>
            <TfiReload size={20} />
          </Button.Icon>
          <Button.Text>Reset Password</Button.Text>
        </Button>
        <Button variant="secondary_2" onClick={onDeactivate}>
          <Button.Icon>
            <IoIosRemoveCircleOutline size={20} />
          </Button.Icon>
          <Button.Text>Deactivate</Button.Text>
        </Button>
      </div>
    </div>
  );
};

const RowGrid = ({ children }: { children: ReactNode }) => {
  return <div className="grid grid-cols-[200px_1fr] gap-2">{children}</div>;
};

const UserModal = ({
  type = "new",
  editData,
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm?: () => void;
  type?: "edit" | "new";
  editData?: {
    name: string;
    email: string;
    role: string;
    reason: string;
    tempPassword: string;
    department: string;
    ticketsAssigned: number;
    status: string;
    lastLogin: Date;
    image: StaticImageData;
    id: number;
  } | null;
}) => {
  const [userData, setUserData] = useState({
    name: editData?.name || "",
    email: editData?.email || "",
    role: editData?.role || "",
    reason: editData?.reason || "",
    tempPassword: editData?.tempPassword || "",
    department: editData?.tempPassword || "",
    check: false,
  });

  const handleDataChange = ({
    vari,
    item,
  }: {
    vari:
      | "name"
      | "email"
      | "role"
      | "reason"
      | "tempPassword"
      | "department"
      | "check";
    item: string | boolean;
  }) => {
    setUserData((prev) => ({
      ...prev,
      [vari]: item,
    }));
  };

  const { roles, department } = teamsDummyFilter;

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center justify-center py-2 border-b border-b-gray-300">
        <Text.Paragraph>
          {type === "edit" ? "Edit User" : "Create User"}
        </Text.Paragraph>
      </div>
      <Column>
        <Text.SmallText className="!text-sm !font-bold">
          Full Name
        </Text.SmallText>
        <div className="input-container">
          <input
            type="text"
            className="text-input"
            placeholder="Enter full name"
            value={userData.name}
            onChange={(e) =>
              handleDataChange({ vari: "name", item: e.target.value })
            }
          />
        </div>
      </Column>
      <Column>
        <Text.SmallText className="!text-sm !font-bold">Email</Text.SmallText>
        <div className="input-container">
          <input
            type="email"
            className="text-input"
            placeholder="Enter your email"
            value={userData.email}
            onChange={(e) =>
              handleDataChange({ vari: "email", item: e.target.value })
            }
          />
        </div>
      </Column>
      <Column>
        <Text.SmallText className="!text-sm !font-bold">
          Change Role
        </Text.SmallText>
        <Dropdown>
          <Dropdown.Trigger className="flex items-center justify-between">
            {userData.role || "Change Role"}
          </Dropdown.Trigger>
          <Dropdown.Content>
            {roles.map((itm) => (
              <Dropdown.Item
                key={itm}
                onClick={() => handleDataChange({ vari: "role", item: itm })}
                className={`${
                  itm === userData.role
                    ? "bg-primary-500/20 text-primary-600 border-primary-600 border"
                    : ""
                }`}
              >
                {itm}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </Column>
      <Column>
        <Text.SmallText className="!text-sm !font-bold">Reason</Text.SmallText>
        <div className="input-container">
          <input
            type="text"
            className="text-input"
            placeholder="Enter Reason"
            value={userData.reason}
            onChange={(e) =>
              handleDataChange({ vari: "reason", item: e.target.value })
            }
          />
        </div>
      </Column>
      <Column>
        <Text.SmallText className="!text-sm !font-bold">
          Select Department
        </Text.SmallText>
        <Dropdown>
          <Dropdown.Trigger className="flex items-center justify-between">
            {userData.department || "Department"}
          </Dropdown.Trigger>
          <Dropdown.Content>
            {department.map((itm) => (
              <Dropdown.Item
                key={itm}
                onClick={() =>
                  handleDataChange({ vari: "department", item: itm })
                }
                className={`${
                  itm === userData.department
                    ? "bg-primary-500/20 text-primary-600 border-primary-600 border"
                    : ""
                }`}
              >
                {itm}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown>
      </Column>

      <Column>
        <Text.SmallText className="!text-sm !font-bold">
          Temporary Password
        </Text.SmallText>
        <div className="input-container">
          <input
            type="text"
            className="text-input"
            placeholder="Set temp. password"
            value={userData.tempPassword}
            onChange={(e) =>
              handleDataChange({ vari: "tempPassword", item: e.target.value })
            }
          />
        </div>
      </Column>
      <div className="flex items-center gap-2">
        <Checkbox
          active={userData.check}
          onCheck={() =>
            handleDataChange({ vari: "check", item: !userData.check })
          }
        />
        <Text.Paragraph>Send welcome Email</Text.Paragraph>
      </div>
      <div className="flex items-center gap-4 w-full">
        <Button variant="secondary_2" className="w-full" onClick={onClose}>
          Cancel
        </Button>
        <Button className="w-full" onClick={onConfirm}>
          {type === "edit" ? "Save Changes" : "Create User"}
        </Button>
      </div>
    </div>
  );
};
