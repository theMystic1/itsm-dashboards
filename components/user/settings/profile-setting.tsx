"use client";

import Text from "@/components/ui/text";
import { IMAGES } from "@/constants/images";
import Image from "next/image";
import { useRef, useState } from "react";
import { BiCamera } from "react-icons/bi";

type IuserType = "firstName" | "lastName" | "email" | "departMent" | "phone";

const ProfileSettings = () => {
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const [userInfo, setUserInfo] = useState({
    firstName: "Michael",
    lastName: "Scolfield",
    email: "michaelscolfield@gmail.com",
    departMent: "Software and development",
    phone: "+481009823",
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

  return (
    <section className="flex flex-col gap-5">
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

      <div className="border-b-gray-200 !border-b w-full flex items-center gap-3">
        <div className="lg:w-[40%] ">
          <Text.Paragraph className="!text-sm">First Name</Text.Paragraph>
          <input
            type="text"
            className="text-input !text-sm"
            value={userInfo.firstName}
            onChange={(e) =>
              handleChange({
                type: "firstName",
                text: e.target.value,
              })
            }
          />
        </div>
        <div className="lg:w-[40%] ">
          <Text.Paragraph className="!text-sm">Last Name</Text.Paragraph>
          <input
            type="text"
            className="text-input !text-sm"
            value={userInfo.lastName}
            onChange={(e) =>
              handleChange({
                type: "lastName",
                text: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="border-b-gray-200 !border-b w-full flex flex-col">
        <Text.Paragraph className="!text-sm whitespace-nowrap">
          Email Address
        </Text.Paragraph>
        <input
          type="text"
          className="text-input !text-sm"
          value={userInfo.email}
          onChange={(e) =>
            handleChange({
              type: "email",
              text: e.target.value,
            })
          }
        />
      </div>
      <div className="border-b-gray-200 !border-b w-full flex flex-col">
        <Text.Paragraph className="!text-sm whitespace-nowrap">
          Department
        </Text.Paragraph>
        <input
          type="text"
          className="text-input !text-sm"
          value={userInfo.departMent}
          onChange={(e) =>
            handleChange({
              type: "departMent",
              text: e.target.value,
            })
          }
        />
      </div>
      <div className="border-b-gray-200 !border-b w-full flex flex-col">
        <Text.Paragraph className="!text-sm whitespace-nowrap">
          Phone Number
        </Text.Paragraph>
        <input
          type="text"
          className="text-input !text-sm"
          value={userInfo.phone}
          onChange={(e) =>
            handleChange({
              type: "phone",
              text: e.target.value,
            })
          }
        />
      </div>
    </section>
  );
};

export default ProfileSettings;
