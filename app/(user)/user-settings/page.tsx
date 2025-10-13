import dynamic from "next/dynamic";

const UsersSettings = dynamic(
  () => import("@/components/user/settings/user-settings")
);

const UserSettings = () => {
  return <UsersSettings type="user" />;
};

export default UserSettings;
