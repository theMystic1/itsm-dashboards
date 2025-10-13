import dynamic from "next/dynamic";

const TechTicks = dynamic(() => import("@/components/tech/technician-tickets"));

const TechTickets = () => {
  return <TechTicks />;
};

export default TechTickets;
