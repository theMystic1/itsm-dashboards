"use client";

import { BiSearch } from "react-icons/bi";
import UserProffileHeader from "../ui/user-profile";
import IncidentOverview, { LengthRep } from "../ui/rechart";
import { LayoutHeader } from "../user/tickets/tickets";
import { TicketMetrics } from "./technician-tickets";

const TechnicianDashboardPage = () => {
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

        <LengthRep />
        <TicketMetrics isTicket={false} />
      </section>
    </main>
  );
};

export default TechnicianDashboardPage;
