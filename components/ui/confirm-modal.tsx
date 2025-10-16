"use client";
import { BiCheckCircle } from "react-icons/bi";
import Button from "./custom-btn";
import { IOSpinner } from "./IOSpinner";
import Text from "./text";
import { HiOutlineMegaphone } from "react-icons/hi2";
import Cookies from "js-cookie";
const ConfirmModal = ({
  title,
  description,
  confirmBtn,
  cancelBtn,
  onConfirm,
  onCancel,
}: {
  title: string;
  description?: string;
  confirmBtn?: string;
  cancelBtn?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}) => {
  return (
    <div className="">
      <div className="flex flex-col items-center gap-2 py-">
        <div className="h-16 w-16 rounded-full bg-primary-500/10 flex items-center justify-center relative">
          <HiOutlineMegaphone className="text-primary-500" size={32} />
        </div>
        <Text.SubHeading className="text-center text-lg font-bold">
          {title}
        </Text.SubHeading>
        <Text.Paragraph className="text-xs">{description}</Text.Paragraph>

        <div className="flex items-center gap-2 w-full">
          <Button
            // className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            onClick={onCancel}
            variant="secondary_2"
            className="w-full text-xs"
          >
            {cancelBtn || "Cancel"}
          </Button>

          <Button
            // className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
            onClick={onConfirm}
            className="w-full text-xs"
          >
            {confirmBtn || "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
};
export const SuccessModal = ({
  title,
  description,
  confirmBtn,
  onConfirm,
}: {
  title: string;
  description?: string;
  confirmBtn?: string;
  cancelBtn?: string;
  onConfirm?: () => void;
}) => {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 w-[80%]">
        <div className="h-16 w-16 rounded-full bg-primary-500/10 flex items-center justify-center relative">
          <BiCheckCircle className="text-primary-500" size={32} />
        </div>
        <Text.SubHeading className="text-center text-lg font-bold">
          {title}
        </Text.SubHeading>
        <Text.Paragraph className="text-xs">{description}</Text.Paragraph>

        <Button className="w-full" onClick={onConfirm}>
          {confirmBtn || "Confirm"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmModal;

const LoadingModal = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  const colors = JSON.parse(Cookies.get("app-theme") || "{}");

  const color = colors?.primary;

  console.log(colors);
  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 ">
        <div className="h-16 w-16 rounded-full bg-primary-500/10 flex items-center justify-center relative">
          <IOSpinner size={56} color={color[500] || ""} />
        </div>
        <Text.SubHeading className="text-center text-lg font-bold">
          {title}
        </Text.SubHeading>
        <Text.Paragraph className="text-xs">{description}</Text.Paragraph>
      </div>
    </div>
  );
};

export { LoadingModal };
