import AdminSettings from "@/components/admin/settings";
import dynamic from "next/dynamic";

const ColorPaletteDialog = dynamic(
  () => import("@/components/ui/color-pallete")
);

const Settings = () => {
  return <AdminSettings />;
};

export default Settings;
