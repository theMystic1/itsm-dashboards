"use client";

import {
  helpCenter,
  recTickets,
  support,
  userHomeLinks,
} from "@/constants/constant";
import { ICONS } from "@/constants/icons";
import { IMAGES } from "@/constants/images";
import Image from "next/image";
import Text from "../ui/text";
import { useRouter } from "next/navigation";
import { BiChevronRight, BiSearch } from "react-icons/bi";
import StatusItem from "../ui/status";
import { Istatus } from "@/types/type";
import Button from "../ui/custom-btn";
import Modal from "../ui/customModal";
import { useEffect, useState } from "react";
import CreateTicketModal from "./create-ticket";
import ConfirmModal, { LoadingModal, SuccessModal } from "../ui/confirm-modal";
import { RightSheet } from "../ui/right-modal";
import TicketProgressInfo from "../ui/ticket-progress";
import UserProffileHeader from "../ui/user-profile";

const UserLanding = () => {
  const { userLanding } = IMAGES;
  const [openModal, setOpenModal] = useState(false);
  const [openOtherModals, setOpenOtherModals] = useState({
    loading: false,
    confirm: false,
    rightPortal: false,
    successModal: false,
  });
  const router = useRouter();

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
    <main className="min-h-screen bg-white">
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
          title="Are you sure you want to close this ticket?"
          description="You won’t be able to reply after closing."
          confirmBtn="Yes, close ticket"
          cancelBtn="No, keep it open"
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
          title="Closed successfully"
          description="Ticket #212510 has been closed successfully!"
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
        title="Right Portal"
        closeOnBackdrop
        width={800}
      >
        <TicketProgressInfo />
      </RightSheet>
      <section className="min-h-[500px] w-full relative ">
        <div className="bg-primary-700/80 absolute inset-0 z-30">
          <nav className="flex items-center justify-between absolute top-6 left-5 right-5">
            <div>USER IMAGE</div>

            <UserProffileHeader textColor="text-white" />
          </nav>
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <Text.Heading className="text-white">
              Good morning Bassey
            </Text.Heading>
            <Text.Heading className="text-white">
              Welcome to IT Experience Hub.
            </Text.Heading>
            <Text.SmallText className="text-white text-xs">
              You have 2 open issue · 1 resolved · 0 awaiting feedback
            </Text.SmallText>

            <div className="min-w-[600px]">
              <div className="input-container flex items-center gap-2">
                <BiSearch color="#fff" />
                <input
                  placeholder="Search your ticket ID etc..."
                  className="text-input text-white"
                />
              </div>
            </div>
          </div>
        </div>
        <Image
          src={userLanding}
          alt="Landing page banner"
          fill
          className="object-top object-cover z-20"
        />
        <div className="absolute -bottom-24 left-0 right-0 h-48 z-30 ">
          <div className="flex items-center gap-5 justify-center w-full h-full z-30 ">
            <div className="grid-3 grid-cols-3 z-30  h-full">
              {userHomeLinks?.map((itm, i) => {
                const Icon = ICONS[itm?.icon];
                // console.log(Icon);
                return (
                  <button
                    className="white-bg h-full min-w-84 shadow-xl flex flex-col gap-1. z-30"
                    key={i}
                    onClick={() => {
                      if (itm.href === "/") {
                        setOpenModal(true);

                        return;
                      }

                      router.push(itm?.href);
                    }}
                  >
                    <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary-600/20">
                      <Icon className="text-primary-500 " size={28} />
                    </div>
                    <Text.SmallHeading className="text-start font-semibold text-sm">
                      {itm?.name}
                    </Text.SmallHeading>

                    <Text.SmallText className="text-start text-xs">
                      {itm?.description}
                    </Text.SmallText>
                  </button>
                );
              })}

              {/* <div className="white-bg h-full min-w-84 shadow-xl"></div>
              <div className="white-bg h-full min-w-84 shadow-xl"></div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-32 px-20 grid gap-4 grid-cols-3">
        <div className="flex flex-col gap-4 ">
          <Text.SmallHeading>Recent Tickets</Text.SmallHeading>
          {recTickets.map((rec, i) => (
            <div
              className="flex items-center gap-4 justify-between border-b border-b-gray-100 pb-2"
              key={i}
            >
              <div>
                <Text.Paragraph>{rec.name}</Text.Paragraph>
                <Text.SmallText className="text-xs text-gray-500">
                  {rec.lastUpdated}
                </Text.SmallText>
              </div>
              <StatusItem
                status={rec.status as Istatus}
                name={rec.statusName}
                dot
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Text.SmallHeading>Help Center Preview</Text.SmallHeading>
          {helpCenter.map((rec, i) => (
            <div
              className="flex items-center gap-4 justify-between border-b border-b-gray-100 pb-2"
              key={i}
            >
              <div>
                <Text.Paragraph>{rec.question}</Text.Paragraph>
              </div>
              <BiChevronRight size={24} />
            </div>
          ))}

          <div></div>
          <div>
            <Button>
              <Button.Text>View All help articles</Button.Text>
              <Button.Icon>
                <ICONS.arrowRight size={24} />
              </Button.Icon>
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Text.SmallHeading>Contact & Support</Text.SmallHeading>
          {support.map((rec, i) => {
            const Icons = ICONS[rec.icon];
            return (
              <div
                className="flex items-center gap-4 justify-between border-b border-b-gray-100 pb-2"
                key={i}
              >
                <div className="flex items-center gap-2">
                  <Icons size={24} />
                  <Text.Paragraph>{rec.name}</Text.Paragraph>
                </div>
              </div>
            );
          })}

          <div></div>
          <div>
            <Button>
              <Button.Icon>
                <ICONS.chat size={24} />
              </Button.Icon>
              <Button.Text>Chat with support</Button.Text>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserLanding;
