"use client";

import { useEffect, useRef, useState } from "react";
import { HeaderSettings } from "./index";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import { BiCamera } from "react-icons/bi";
import { Column, EmptyUploader } from "@/components/user/create-ticket";
import Text from "@/components/ui/text";
import { FileUploader } from "./uploader";
import Cookies from "js-cookie";
import { oklchCssToHexGamutMapped } from "@/lib/helpers";
import Modal from "@/components/ui/customModal";
import ColorPaletteDialog from "@/components/ui/color-pallete";
import ConfirmModal, {
  LoadingModal,
  SuccessModal,
} from "@/components/ui/confirm-modal";
import {
  buildThemePayload,
  applyThemeScales,
  saveThemeToLocalStorage,
} from "@/lib/theme-utils";

const PersonalAdmin = () => {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [userInfo, setUserInfo] = useState({
    firstName: "Michael",
    lastName: "Scolfield",
    email: "michaelscolfield@gmail.com",
    departMent: "Software and development",
    phone: "+481009823",
  });
  const [openModal, setOpenModal] = useState({
    open: false,
    hex: "",
  });
  const [openOtherModals, setOpenOtherModals] = useState({
    loading: false,
    confirm: false,
    rightPortal: false,
    successModal: false,
  });
  const [logoFavicon, setLogoFavicon] = useState<{
    logo: File[];
    favicon: File[];
  }>({
    logo: [],
    favicon: [],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = ({
    text,
    type,
  }: {
    type: "firstName" | "lastName" | "email" | "departMent" | "phone";
    text: string;
  }) => {
    setUserInfo((prev) => ({
      ...prev,
      [type]: text,
    }));
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const primaryColor = Cookies.get("app-theme");

  const parsedPrimaryColor = primaryColor && JSON.parse(primaryColor)?.primary;

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
    <div className="flex flex-col gap-5">
      <Modal
        isOpen={openModal.open}
        onClose={() =>
          setOpenModal((prev) => ({
            ...prev,
            open: false,
          }))
        }
        maxWidth="max-w-[450px]"
      >
        <ColorPaletteDialog
          onSave={(hex) => {
            setOpenModal({
              hex,
              open: false,
            });

            setOpenOtherModals((prev) => ({
              ...prev,
              confirm: true,
            }));
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
          title="Submitting Request"
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
          title="Confirm Brand Color change"
          description="This action will replace the UI primary color"
          confirmBtn="Yes, Proceed"
          cancelBtn="No, go back"
          onConfirm={() => {
            // 1) build full scales (50..900) for primary from the chosen hex
            const theme = buildThemePayload({ primaryHex: openModal.hex });

            // 2) persist for future loads
            saveThemeToLocalStorage("app-theme", theme);

            // 3) apply now (no rebuild)
            applyThemeScales(theme); // 1) build full scales (50..900) for primary from the chosen hex

            setOpenOtherModals((prev) => ({
              ...prev,
              confirm: false,
              loading: true,
            }));
          }}
          onCancel={() => {
            setOpenOtherModals((prev) => ({ ...prev, confirm: false }));
            setOpenModal((prev) => ({
              ...prev,
              open: true,
            }));
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
          title="Brand color saved Successfully"
          description="You have replaced the overall UI primary color"
          confirmBtn="Okay"
          onConfirm={() => {
            setOpenOtherModals((prev) => ({
              ...prev,
              successModal: false,
              rightPortal: false,
            }));
          }}
        />
      </Modal>
      <HeaderSettings header="Personal Information" />

      <div className="h-12 w-12 relative rounded-full border border-gray-300">
        <Image
          src={preview || IMAGES.userLanding}
          fill
          alt="User image"
          className="rounded-full object-cover"
        />
        <button
          className="absolute left-0 right-0 bottom-0 h-6 bg-black/40 hover:bg-black/60 transition-all duration-300 cursor-pointer flex items-center justify-center rounded-b-full"
          onClick={handleAttachClick}
        >
          <BiCamera className="text-primary-500" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />

      <div className="grid-2">
        <Column>
          <Text.Paragraph className="text-sm font-bold">
            First Name
          </Text.Paragraph>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter your First name"
              className="text-input"
            />
          </div>
        </Column>
        <Column>
          <Text.Paragraph className="text-sm font-bold">
            Last Name
          </Text.Paragraph>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter your Last name"
              className="text-input"
            />
          </div>
        </Column>
        <Column>
          <Text.Paragraph className="text-sm font-bold">
            Email Address
          </Text.Paragraph>
          <div className="input-container">
            <input
              type="email"
              placeholder="Enter your email address"
              className="text-input"
            />
          </div>
        </Column>
        <Column>
          <Text.Paragraph className="text-sm font-bold">
            Department
          </Text.Paragraph>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter your department"
              className="text-input"
            />
          </div>
        </Column>
        <Column>
          <Text.Paragraph className="text-sm font-bold">
            Phone Number
          </Text.Paragraph>
          <div className="input-container">
            <input
              type="number"
              placeholder="Enter your Phone number"
              className="text-input"
            />
          </div>
        </Column>
        <Column>
          <Text.Paragraph className="text-sm font-bold">
            Password
          </Text.Paragraph>
          <div className="input-container">
            <input
              type="password"
              placeholder="Enter your Password"
              className="text-input"
            />
          </div>
        </Column>
      </div>

      <Column>
        <div className="border-t border-t-gray-200 py-3">
          <HeaderSettings header="Branding / Company settings" />
        </div>

        <div className="grid-2">
          <div className="flex flex-col">
            <Text.Paragraph className="text-sm font-bold">
              Company Logo
            </Text.Paragraph>
            <div className="">
              <FileUploader
                acceptedFormats="Drag & drop your logo or click to upload. supported format PNG, JPG, SVG"
                onFiles={(files) => {
                  // upload or preview

                  console.log(files);
                }}
                enableDragDrop
                multiple={false}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <Text.Paragraph className="text-sm font-bold">
              Favicon / Browser Icon (Optional)
            </Text.Paragraph>
            <div className="">
              <FileUploader
                acceptedFormats="Drag & drop your logo or click to upload. supported format PNG, JPG, SVG"
                onFiles={(files) => {
                  // upload or preview
                  console.log(files);
                }}
                enableDragDrop
                multiple={false}
              />
            </div>
          </div>
        </div>

        <div>
          <Text.Paragraph className="font-semibold text-sm">
            Brand Primary Color
          </Text.Paragraph>

          <button
            className="input-container cursor-pointer flex items-center gap-4"
            onClick={() =>
              setOpenModal((prev) => ({
                ...prev,
                open: true,
              }))
            }
          >
            <div className="h-6 w-6 rounded-sm bg-primary-600" />

            <Text.Paragraph>
              {parsedPrimaryColor &&
                oklchCssToHexGamutMapped(parsedPrimaryColor?.[600])}
            </Text.Paragraph>
          </button>
        </div>
      </Column>
    </div>
  );
};

export default PersonalAdmin;
