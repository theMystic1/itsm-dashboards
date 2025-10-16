"use client";

import { TicketMetrics } from "@/components/tech/technician-tickets";
import Button from "@/components/ui/custom-btn";
import Modal from "@/components/ui/customModal";
import Dropdown from "@/components/ui/dropdown";
import StatusItem from "@/components/ui/status";
import {
  Table,
  TableOverflow,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@/components/ui/table";
import Text from "@/components/ui/text";
import TogleSlide, { useSyncedSlide } from "@/components/ui/toggle-slide";
import UserProffileHeader from "@/components/ui/user-profile";
import { dummyTickets, table_heading } from "@/constants/constant";
import { formatDateProper, formatTo12Hour } from "@/lib/helpers";
import { Istatus } from "@/types/type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import CreateTicketModal from "../create-ticket";
import ConfirmModal, {
  LoadingModal,
  SuccessModal,
} from "@/components/ui/confirm-modal";
import { RightSheet } from "@/components/ui/right-modal";
import TicketProgressInfo from "@/components/ui/ticket-progress";

const list = ["Priority", "Date"];

const Tickets = ({ type }: { type: "user" | "tech" }) => {
  const slides = ["All", "New", "Critical", "Overdue", "Resolved"];
  const { activeSlide, setSlide } = useSyncedSlide(slides, "All", "slide");

  const [openModal, setOpenModal] = useState(false);
  const [openOtherModals, setOpenOtherModals] = useState({
    loading: false,
    confirm: false,
    rightPortal: false,
    successModal: false,
  });
  // const router = useRouter();

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

  return (
    <main className=" flex flex-col gap-5 min-h-screen">
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        // maxWidth="max-w-[400px]"
      >
        <CreateTicketModal
          close={() => setOpenModal(false)}
          onSubmit={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              confirm: true,
            }));
            setOpenModal(false);
          }}
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
          title="Submitting ticket"
          description="Please wait a moment"
        />
      </Modal>

      <Modal
        isOpen={openOtherModals.confirm}
        maxWidth="max-w-sm"
        onClose={() =>
          setOpenOtherModals((prev) => ({ ...prev, confirm: false }))
        }
      >
        <ConfirmModal
          title="Are you sure you want to Create this ticket?"
          description="Click on the proceed button to continue"
          confirmBtn="Proceed"
          cancelBtn="Cakncel"
          onConfirm={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              confirm: false,
              loading: true,
            }));
          }}
          onCancel={() => {
            setOpenOtherModals((prev) => ({ ...prev, confirm: false }));
            setOpenModal(true);
          }}
        />
      </Modal>
      <Modal
        isOpen={openOtherModals.successModal}
        maxWidth="max-w-sm"
        onClose={() =>
          setOpenOtherModals((prev) => ({ ...prev, successModal: false }))
        }
      >
        <SuccessModal
          title="Created successfully"
          description="Ticket #212510 has been Created successfully!"
          confirmBtn="View ticket progress"
          onConfirm={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              successModal: false,
              rightPortal: true,
            }));
          }}
        />
      </Modal>
      <RightSheet
        open={openOtherModals.rightPortal}
        onClose={() =>
          setOpenOtherModals((prev) => ({ ...prev, rightPortal: false }))
        }
        title="Ticket ID #1234567"
        closeOnBackdrop
        width={800}
      >
        <TicketProgressInfo />
      </RightSheet>
      <nav className="white-bg flex items-center justify-between">
        <div className="input-container flex items-center gap-2 max-w-[400px]">
          <BiSearch size={20} color="#1f1919" />
          <input
            type="text"
            className="text-input"
            placeholder="Search for ticket ID, etc..."
          />
        </div>

        <UserProffileHeader textColor="" />
      </nav>

      <section className="white-bg flex-1 p-3">
        <div className="flex justify-between items-center mb-4">
          <Text.Heading className="!text-xl">
            {type === "user" ? "My" : ""} Tickets
          </Text.Heading>

          <div className="flex items-center gap-3">
            <Dropdown>
              <Dropdown.Trigger className="flex items-center ">
                <Text.Paragraph className="!text-base !font-semibold">
                  Sort by
                </Text.Paragraph>
              </Dropdown.Trigger>
              <Dropdown.Content className="w-full">
                {list?.map((ls, i) => (
                  <Dropdown.Item key={i}>
                    <Text.SmallText className="!capitalize !font-semibold">
                      {ls}
                    </Text.SmallText>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
            {type === "user" && (
              <Button onClick={() => setOpenModal(true)}>
                <Button.Icon>
                  <PiPlus size={20} />
                </Button.Icon>
                <Button.Text>Report an Issue</Button.Text>
              </Button>
            )}
          </div>
        </div>

        {type === "tech" ? (
          <div className="my-5 flex flex-col gap-5">
            <TicketMetrics isTicket tech={type === "tech"} />

            <Suspense>
              <TogleSlide
                slides={slides}
                activeSlide={activeSlide}
                onSlideChange={setSlide}
              />
            </Suspense>
          </div>
        ) : null}
        <TableOverflow className="flex-1">
          <Table className="flex-1">
            <Thead>
              <Tr className="border-b border-b-[#d4d4d4]">
                {table_heading?.map((head, i) => {
                  if (head.type === "text") {
                    return (
                      <Th key={i}>
                        <Text.Paragraph className="!text-base !font-semibold">
                          {type === "tech"
                            ? table_heading[table_heading.length - 1]
                              ? "SLA Timing"
                              : head.name
                            : head.name}
                        </Text.Paragraph>
                      </Th>
                    );
                  }

                  return (
                    <Th key={i}>
                      <Dropdown>
                        <Dropdown.Trigger
                          className="flex items-center "
                          isNormal
                        >
                          <Text.Paragraph className="!text-base !font-semibold">
                            {head.name}
                          </Text.Paragraph>
                        </Dropdown.Trigger>
                        <Dropdown.Content className="w-[150px]">
                          {head.list?.map((ls, i) => (
                            <Dropdown.Item key={i}>
                              <Text.SmallText className="!capitalize !font-semibold">
                                {ls}
                              </Text.SmallText>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Content>
                      </Dropdown>
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {dummyTickets?.map((tick) => (
                <Tr
                  key={tick.ticketId}
                  className="border-b border-b-[#d4d4d4] cursor-pointer "
                  onClick={() =>
                    setOpenOtherModals((prev) => ({
                      ...prev,
                      rightPortal: true,
                    }))
                  }
                >
                  <Td>
                    <Text.LinkText>{tick.ticketId}</Text.LinkText>
                  </Td>
                  <Td>{tick.title}</Td>
                  <Td>{tick.category}</Td>
                  <Td className="flex items-center gap-2">
                    <Image
                      src={tick.assignedTo.image}
                      height={16}
                      width={16}
                      alt="User image"
                      className="rounded-full"
                    />
                    <Text.SmallText>{tick.assignedTo?.name}</Text.SmallText>
                  </Td>
                  <Td>
                    <StatusItem
                      status={
                        tick.priorityLevel.toLowerCase().includes("critical")
                          ? "danger"
                          : tick.priorityLevel.toLowerCase().includes("low")
                          ? "open"
                          : tick.priorityLevel.toLowerCase().includes("high")
                          ? "resolved"
                          : tick.priorityLevel.toLowerCase().includes("medium")
                          ? "progress"
                          : "waiting"
                      }
                      name={tick.priorityLevel}
                    />
                  </Td>
                  <Td>{tick.module}</Td>
                  <Td>
                    <StatusItem
                      status={tick.status as Istatus}
                      name={tick.status}
                      dot
                    />
                  </Td>
                  <Td>{`${formatTo12Hour(
                    new Date(tick.updatedAt)
                  )}, ${formatDateProper(new Date(tick.updatedAt))}`}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableOverflow>
      </section>
    </main>
  );
};

export default Tickets;

export const LayoutHeader = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <Text.Heading className="!text-xl">{title}</Text.Heading>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
