import dynamic from "next/dynamic";

const ColorPaletteDialog = dynamic(
  () => import("@/components/ui/color-pallete")
);

const Settings = () => {
  return <ColorPaletteDialog />;
};

export default Settings;
