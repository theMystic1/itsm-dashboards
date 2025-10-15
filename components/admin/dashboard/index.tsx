"use client";

import { TicketMetrics } from "@/components/tech/technician-tickets";
import IncidentOverview, {
  BacklogOfOverdueIncidents,
  LengthRep,
  VolumeCharts,
} from "@/components/ui/rechart";
import UserProffileHeader from "@/components/ui/user-profile";
import { LayoutHeader } from "@/components/user/tickets/tickets";
import { BiSearch } from "react-icons/bi";

const AdminDashboardPage = () => {
  return (
    <main className="flex flex-col gap-5 min-h-screen">
      <nav className="white-bg flex items-center justify-between">
        <div className="input-container flex items-center gap-2 max-w-[400px]">
          <BiSearch size={20} color="#1f1919" />
          <input
            type="text"
            className="text-input"
            placeholder="Search for ticket ID, etc..."
          />
        </div>

        <UserProffileHeader textColor="" />
      </nav>

      <section className="white-bg flex-1 flex flex-col gap-5">
        <LayoutHeader title="Dashboard">
          <></>
        </LayoutHeader>
        <IncidentOverview />
        <TicketMetrics isTicket={false} />
        <VolumeCharts />
        <BacklogOfOverdueIncidents fullLog />
        <LengthRep />
      </section>
    </main>
  );
};

export default AdminDashboardPage;
