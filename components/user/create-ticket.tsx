"use client";

import {
  dummyCategory,
  dummyModules,
  priorityLevels,
} from "@/constants/constant";
import Dropdown from "../ui/dropdown";
import Text from "../ui/text";
import { useRef, useState } from "react";
import { LuFileCheck2 } from "react-icons/lu";
import Button from "../ui/custom-btn";
import { CgClose } from "react-icons/cg";
import { BiMinus } from "react-icons/bi";
import { PiPlus } from "react-icons/pi";
import { CgFile } from "react-icons/cg";
import { humanSize } from "@/lib/helpers";
import { IoCloseCircle } from "react-icons/io5";

const CreateTicketModal = ({
  close,
  onSubmit,
}: {
  close: () => void;
  onSubmit: () => void;
}) => {
  const [priority, setPriority] = useState("");
  const [catModule, setCatModule] = useState({
    category: "Category",
    module: "Module",
  });
  const [files, setFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  // console.log(files);

  return (
    <div className="flex flex-col gap-4">
      <Column title="Ticket Title" desc="Enter a title for your issue">
        <div className="input-container">
          <input
            type="text"
            className="text-input h-full"
            placeholder="E.g., Unable to access account"
          />
        </div>
      </Column>
      <Column
        title="Description"
        desc="Please describe the issue so our team can assist you"
      >
        <div className="input-container py-3">
          <textarea
            className="text-input h-full"
            placeholder="E.g., Unable to access account"
            cols={4}
            rows={4}
          />
        </div>
      </Column>

      <Row>
        <Column
          title="Category"
          desc="Select a category that best fits your issue "
        >
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              {catModule.category}
            </Dropdown.Trigger>
            <Dropdown.Content>
              {dummyCategory?.map((cat) => (
                <Dropdown.Item
                  key={cat}
                  className={`${
                    cat === catModule.category
                      ? "bg-primary-400 border border-primary-600"
                      : ""
                  }`}
                  onClick={() => setCatModule({ ...catModule, category: cat })}
                >
                  {cat}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </Column>
        <Column title="Module" desc="Choose the module type">
          <Dropdown>
            <Dropdown.Trigger className="flex items-center justify-between">
              {catModule.module}
            </Dropdown.Trigger>
            <Dropdown.Content>
              {dummyModules?.map((mod) => (
                <Dropdown.Item
                  key={mod}
                  className={`${
                    mod === catModule.module
                      ? "bg-primary-400 border border-primary-600"
                      : ""
                  }`}
                  onClick={() => setCatModule({ ...catModule, module: mod })}
                >
                  {mod}
                </Dropdown.Item>
              ))}
            </Dropdown.Content>
          </Dropdown>
        </Column>
      </Row>

      <Column title="Priority" desc="How urgent is this issue to your work?">
        <div className="flex items-center gap-4 justify-between">
          {
            priorityLevels.map((level) => (
              <Radio
                key={level.level}
                label={level?.level}
                selected={priority}
                onClick={() => setPriority(level.level)}
              />
            )) // you can change the selected value to a state variable to make it dynamic
          }
        </div>
      </Column>
      <Column
        title="Attachments (Screenshot/Files)"
        desc="Attach any screenshots or logs that might help."
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="input-container py-2">
          {files.length === 0 ? (
            <EmptyUploader onClick={handleAttachClick} />
          ) : (
            <div className="grid grid-2 gap-2">
              {
                files.map((file, i) => (
                  <FilePreview
                    key={i}
                    file={file}
                    remove={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  />
                )) // you can map through the files state to show previews
              }
              <button
                className="p-2 w-16 border border-gray-400 rounded-lg flex-row-center"
                onClick={handleAttachClick}
              >
                <PiPlus size={32} />
              </button>
            </div>
          )}
        </div>
      </Column>

      <div className="grid grid-cols-3  gap-2">
        <Button variant="secondary_2" onClick={close}>
          <Button.Icon>
            <CgClose size={24} />
          </Button.Icon>
          <Button.Text>Cancel and Exit</Button.Text>
        </Button>
        <Button variant="secondary_2">
          <Button.Icon>
            <BiMinus size={24} />
          </Button.Icon>
          <Button.Text>Clear all</Button.Text>
        </Button>

        <Button onClick={onSubmit}>
          <Button.Icon>
            <PiPlus size={24} />
          </Button.Icon>
          <Button.Text>Submit Issue</Button.Text>
        </Button>
      </div>
    </div>
  );
};

export default CreateTicketModal;

export const Column = ({
  title,
  children,
  desc,
}: {
  title?: string;
  desc?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <Text.SubHeading className="text-gray-600 text-sm font-semibold">
        {title}
      </Text.SubHeading>
      <Text.SmallText className="text-xs text-gray-500">{desc}</Text.SmallText>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
};

export const Row = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-6">{children}</div>;
};

export const Radio = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: string;
  onClick?: () => void;
}) => {
  return (
    <button
      className="flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`${
          label === selected
            ? "border-primary-500 border-4"
            : "border-gray-300 border"
        }  h-5 w-5 rounded-full`}
      />
      <Text.Paragraph className="font-semibold text-sm">{label}</Text.Paragraph>
    </button>
  );
};

export const EmptyUploader = ({
  onClick,
  acceptedFormats = "Accepted formats: PNG, JPG, PDF, DOCX",
}: {
  onClick?: () => void;
  acceptedFormats?: string;
}) => {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <LuFileCheck2 className="text-primary-600" size={28} />
        <div className="flex flex-col justify-center  gap-2   rounded-lg">
          <Text.Paragraph className="text-sm text-gray-500">
            {acceptedFormats}
          </Text.Paragraph>
          <Text.SmallText className="text-xs text-gray-400">
            (Max file size: 10MB)
          </Text.SmallText>
        </div>
      </div>

      <Button variant="secondary_2" onClick={onClick}>
        Browse
      </Button>
    </div>
  );
};

export const FilePreview = ({
  file,
  remove,
  deletAble = true,
}: {
  file: File;
  remove: () => void;
  deletAble?: boolean;
}) => {
  return (
    <div className="grid grid-cols-[40px_1fr] gap-1 items-center p-2 border border-gray-200 rounded-lg relative w-full">
      {deletAble && (
        <button
          className="absolute -top-2 -right-2 text-gray-500 cursor-pointer"
          onClick={remove}
        >
          <IoCloseCircle size={20} />
        </button>
      )}
      <div>
        <CgFile size={32} />
        <Text.Paragraph className="text-sm text-primary-500  font-semibold">
          {(file.type?.split("/")[1] ?? "FILE").toUpperCase()}
        </Text.Paragraph>
      </div>

      {/* allow shrinking & wrapping */}
      <div className="min-w-0 w-full">
        <Text.Paragraph className="text-xs break-words whitespace-normal block">
          {file.name}
        </Text.Paragraph>
        <Text.Paragraph className="text-xs text-gray-400">
          {humanSize(file.size)}
        </Text.Paragraph>
      </div>
    </div>
  );
};
