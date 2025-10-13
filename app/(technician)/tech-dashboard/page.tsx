import dynamic from "next/dynamic";

const TechnicianDashboardPage = dynamic(
  () => import("@/components/tech/tech-dash")
);

const TechDashboard = () => {
  return <TechnicianDashboardPage />;
};

export default TechDashboard;
