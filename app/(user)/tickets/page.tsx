import dynamic from "next/dynamic";

const Tickets = dynamic(() => import("@/components/user/tickets/tickets"));

const MyTickets = () => {
  return <Tickets type="user" />;
};

export default MyTickets;
