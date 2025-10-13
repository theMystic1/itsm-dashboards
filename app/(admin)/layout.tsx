import ClientLayouts from "@/components/ui/client-layout";
import { AdminLayoutLinks } from "@/constants/constant";
import { ReactNode } from "react";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return <ClientLayouts navLinks={AdminLayoutLinks}>{children}</ClientLayouts>;
};

export default AdminLayout;
