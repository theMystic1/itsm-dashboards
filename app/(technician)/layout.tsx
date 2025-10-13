import ClientLayouts from "@/components/ui/client-layout";
import { TechLayoutLinks } from "@/constants/constant";
import { ChildType } from "@/types/type";

const TechLayout = ({ children }: ChildType) => {
  return <ClientLayouts navLinks={TechLayoutLinks}>{children}</ClientLayouts>;
};
export default TechLayout;
