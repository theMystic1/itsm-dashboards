import ClientLayouts from "@/components/ui/client-layout";
import { UserLayoutLinks } from "@/constants/constant";
import { ChildType } from "@/types/type";

const UserLayout = ({ children }: ChildType) => {
  return <ClientLayouts navLinks={UserLayoutLinks}>{children}</ClientLayouts>;
};
export default UserLayout;
