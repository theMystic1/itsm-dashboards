import dynamic from "next/dynamic";

const UsersSettings = dynamic(
  () => import("@/components/user/settings/user-settings")
);

const TechSettings = () => {
  return <UsersSettings type="tech" />;
};

export default TechSettings;
