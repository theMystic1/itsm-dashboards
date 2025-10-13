// import {
//   BiGridAlt, // Dashboard
//   BiCog, // Settings
//   BiUser, // User Management
//   BiNotepad, // Issue Logs
//   BiLineChart, // Analytics & Reports
//   BiBell, // Notification & Alert
//   BiHistory, // Audit Trail
// } from "react-icons/bi";
// import { ICONS } from "./icons";

import { Activity, Istatus, NavItem } from "@/types/type";
import dayjs from "dayjs";
import { p } from "framer-motion/client";
import { LOCAL_ICONS } from "./icons";

// const { dashboard, settings, user, issues, analytics, notifications, audit } =
//   ICONS;

export const AdminLayoutLinks: NavItem = [
  { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { name: "Settings", href: "/settings", icon: "settings" },
  { name: "User Management", href: "/users", icon: "user" },
  { name: "Issue Logs", href: "/issues", icon: "issues" },
  { name: "Analytics & Reports", href: "/reports", icon: "analytics" },
  {
    name: "Notification & Alert",
    href: "/notifications",
    icon: "notifications",
  },
  { name: "Audit Trail", href: "/audit", icon: "audit" },
];

export const UserLayoutLinks: NavItem = [
  { name: "Home", href: "/", icon: "dashboard" },
  { name: "My Tickets", href: "/tickets", icon: "tickets" },
  { name: "Settings", href: "/user-settings", icon: "settings" },
];
export const TechLayoutLinks: NavItem = [
  { name: "Dashboard", href: "/tech-dashboard", icon: "dashboard" },
  { name: "Tickets", href: "/tech-tickets", icon: "tickets" },
  { name: "Settings", href: "/tech-settings", icon: "settings" },
];

export const userHomeLinks: NavItem = [
  {
    name: "Report an Issue",
    href: "/",
    icon: "tools",
    description: "Something's broken? Start here",
  },
  {
    name: "My Tickets",
    href: "/tickets",
    icon: "tickets",
    description: "Track or update your existing issues.",
  },
  {
    name: "Settings",
    href: "/user-settings",
    icon: "settings",
    description: "Explore our comprehensive self-service management.",
  },
];

export const recTickets = [
  {
    name: "Time Entry Missing",
    lastUpdated: "Updated 45 minutes ago",
    statusName: "Opened",
    status: "open",
  },

  {
    name: "Dashboard KPI Not Updating",
    lastUpdated: "Updated 57 minutes ago",
    statusName: "Opened",
    status: "open",
  },
  {
    name: "Time Entry Approval Workflow",
    lastUpdated: "Updated 57 minutes ago",
    statusName: "In progress",
    status: "progress",
  },
];

export const helpCenter = [
  {
    question: "Lorem ipsum dolor ",
    answer: "Isit amet consectetur adipisicing elit. Dolores tenetur ",
  },
  {
    question: "Nenim deleniti perspiciatis ",
    answer:
      "Lodit sapiente, iure ut quibusdam quos facilis. Porro officia incidunt magnam obcaecati, ",
  },
  {
    question: "Moptio placeat, aut et iusto",
    answer:
      "Idebitis, omnis veritatis nulla pariatur cupiditate ullam doloribus. Error tempore velit necessitatibus voluptatum vitae mollitia. Iste sed saepe beatae tempora.",
  },
];

export const support: NavItem = [
  {
    name: "hq@seamflex.com",
    href: "/",
    icon: "email",
    description: "Something's broken? Start here",
  },
  {
    name: "hq@seamflex.com",
    href: "/",
    icon: "call",
  },
];

export const priorityLevels = [
  { level: "Low", color: "bg-green-100 text-green-800" },
  { level: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { level: "High", color: "bg-red-100 text-red-800" },
  { level: "Critical", color: "bg-purple-100 text-purple-800" },
];

export const dummyCategory = [
  "Software",
  "Hardware",
  "Network",
  "Account Access",
  "Performance",
  "Security",
  "Other",
];

export const dummyModules = [
  "User Management",
  "Reporting",
  "Dashboard",
  "Notifications",
  "Integrations",
  "Settings",
  "Help Center",
];

export const ticketLifecycle = [
  {
    name: "New",
    status: "open",
  },
  {
    name: "Opened",
    status: "open",
  },
  {
    name: "Blocked",
    status: "danger",
  },
  {
    name: "In progress",
    status: "progress",
  },
  {
    name: "Resolved",
    status: "resolved",
  },
  {
    name: "Waiting on user",
    status: "waiting",
  },
  {
    name: "Closed",
    status: "open",
  },
];

export const dummyTags: {
  title: string;
  type: string;
  value: any;
}[] = [
  {
    title: "Status",
    type: "status",
    value: "Resolved",
  },
  {
    title: "Module",
    type: "text",
    value: "Project",
  },
  {
    title: "Ticket ID",
    type: "underline",
    value: "#12345",
  },
  {
    title: "Priority",
    type: "status",
    value: "High",
  },
  {
    title: "Created",
    type: "date",
    value: new Date(),
  },
  {
    title: "Last Updated",
    type: "date",
    value: new Date(),
  },
  {
    title: "Category",
    type: "text",
    value: "Bug / Error",
  },
  {
    title: "Due date",
    type: "date",
    value: new Date(),
  },
  {
    title: "Assigned to",
    type: "user",
    value: {
      name: "John Doe",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  },
  {
    title: "SLA clock",
    type: "text",
    value: "4h 15m remaining",
  },
];

export const activities: Activity[] = [
  {
    id: "a-3",
    type: "status_change",
    actor: {
      id: "u-1",
      name: "Jacob Jones",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    at: dayjs().subtract(10, "minute").toISOString(),
    from: "open",
    to: "progress",
  },
  {
    id: "a-2",
    type: "comment",
    actor: {
      id: "u-1",
      name: "Jacob Jones",
      avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    at: dayjs().subtract(1, "hour").toISOString(),
    ticketId: "#212501",
    text: "I'm actively working on resolving the issues with the system update. Let's set up a quick call to troubleshoot together. Regards.",
  },
  {
    id: "a-1",
    type: "ticket_created",
    actor: {
      id: "u-2",
      name: "Bassey Bassey",
      avatarUrl: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    at: dayjs().subtract(1, "day").toISOString(),
    ticketId: "#212501",
    initial: "open",
    next: "open",
  },
];

// ===== Labels for Istatus (UI text only) =====
export const label: Record<Istatus, string> = {
  open: "Opened",
  danger: "Blocked",
  progress: "In Progress",
  resolved: "Resolved",
  waiting: "Waiting on User",
};

export const table_heading = [
  {
    name: "Ticket ID",
    type: "text",
    list: [],
  },
  {
    name: "Title",
    type: "text",
    list: [],
  },
  {
    name: "Category",
    type: "drop_down",
    list: ["Bug", "Feature", "Improvement", "Incident", "Task", "Compliance"],
  },
  {
    name: "Assigned to",
    type: "text",
    list: [],
  },
  {
    name: "Priority",
    type: "drop_down",
    list: ["critical", "high", "medium", "low"],
  },
  {
    name: "Module",
    type: "drop_down",
    list: [
      "Authentication",
      "Identity",
      "Dashboard",
      "Reports",
      "API",
      "Messaging",
      "Time Tracking",
    ],
  },
  {
    name: "Status",
    type: "drop_down",
    list: ["open", "danger", "progress", "resolved", "waiting"],
  },

  {
    name: "Last Updated",
    type: "text",
    list: [],
  },
];
export const dummyTickets = [
  {
    ticketId: "TCK-1001",
    category: "Bug",
    assignedTo: {
      name: "Adaeze Okafor",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    title: "Login button unresponsive on Safari iOS",
    priorityLevel: "high",
    status: "open",
    module: "Authentication",
    updatedAt: "2025-10-12T08:30:00Z",
  },
  {
    ticketId: "TCK-1002",
    category: "Feature",
    assignedTo: {
      name: "James Cole",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    title: "Add SSO with Azure AD",
    priorityLevel: "critical",
    status: "progress",
    module: "Identity",
    updatedAt: "2025-10-12T09:05:00Z",
  },
  {
    ticketId: "TCK-1003",
    category: "Improvement",
    assignedTo: {
      name: "Fatima Bello",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    title: "Optimize dashboard load time under 2s",
    priorityLevel: "medium",
    status: "waiting",
    module: "Dashboard",
    updatedAt: "2025-10-11T18:12:00Z",
  },
  {
    ticketId: "TCK-1004",
    category: "Bug",
    assignedTo: {
      name: "Wei Zhang",
      image: "https://randomuser.me/api/portraits/men/71.jpg",
    },
    title: "CSV export includes hidden columns",
    priorityLevel: "low",
    status: "resolved",
    module: "Reports",
    updatedAt: "2025-10-10T14:47:00Z",
  },
  {
    ticketId: "TCK-1005",
    category: "Incident",
    assignedTo: {
      name: "Ijeoma N.",
      image: "https://randomuser.me/api/portraits/women/49.jpg",
    },
    title: "Spike in 500 errors on API v2",
    priorityLevel: "critical",
    status: "danger",
    module: "API",
    updatedAt: "2025-10-12T10:20:00Z",
  },
  {
    ticketId: "TCK-1006",
    category: "Task",
    assignedTo: {
      name: "Rafael Dias",
      image: "https://randomuser.me/api/portraits/men/83.jpg",
    },
    title: "Refactor notification service",
    priorityLevel: "medium",
    status: "progress",
    module: "Messaging",
    updatedAt: "2025-10-12T07:55:00Z",
  },
  {
    ticketId: "TCK-1007",
    category: "Bug",
    assignedTo: {
      name: "Amina Yusuf",
      image: "https://randomuser.me/api/portraits/women/37.jpg",
    },
    title: "Time tracker rounding issue (minutes > 60)",
    priorityLevel: "high",
    status: "open",
    module: "Time Tracking",
    updatedAt: "2025-10-11T21:33:00Z",
  },
  {
    ticketId: "TCK-1008",
    category: "Compliance",
    assignedTo: {
      name: "John Park",
      image: "https://randomuser.me/api/portraits/men/28.jpg",
    },
    title: "Update data retention policy to 7 years",
    priorityLevel: "low",
    status: "waiting",
    module: "Reports",
    updatedAt: "2025-10-09T16:02:00Z",
  },
  {
    ticketId: "TCK-1009",
    category: "Feature",
    assignedTo: {
      name: "Sara Ahmed",
      image: "https://randomuser.me/api/portraits/women/12.jpg",
    },
    title: "Introduce teams & roles switcher",
    priorityLevel: "high",
    status: "progress",
    module: "Identity",
    updatedAt: "2025-10-12T11:10:00Z",
  },
  {
    ticketId: "TCK-1010",
    category: "Incident",
    assignedTo: {
      name: "Tomás Alvarez",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    title: "Webhook retries failing after deploy",
    priorityLevel: "critical",
    status: "open",
    module: "API",
    updatedAt: "2025-10-12T10:58:00Z",
  },
  {
    ticketId: "TCK-1011",
    category: "Bug",
    assignedTo: {
      name: "Chika Obi",
      image: "https://randomuser.me/api/portraits/women/80.jpg",
    },
    title: "UAT: SLA countdown freezes on tab switch",
    priorityLevel: "medium",
    status: "open",
    module: "Messaging",
    updatedAt: "2025-10-11T12:40:00Z",
  },
  {
    ticketId: "TCK-1012",
    category: "Improvement",
    assignedTo: {
      name: "Liam O’Connor",
      image: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    title: "Add pagination to Transactions table",
    priorityLevel: "low",
    status: "resolved",
    module: "Reports",
    updatedAt: "2025-10-10T09:25:00Z",
  },
  {
    ticketId: "TCK-1013",
    category: "Task",
    assignedTo: {
      name: "Ngozi Eze",
      image: "https://randomuser.me/api/portraits/women/9.jpg",
    },
    title: "Create runbook for on-call rotation",
    priorityLevel: "medium",
    status: "waiting",
    module: "API",
    updatedAt: "2025-10-08T15:12:00Z",
  },
  {
    ticketId: "TCK-1014",
    category: "Bug",
    assignedTo: {
      name: "Ravi Kumar",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
    title: "Search results ignore archived filters",
    priorityLevel: "high",
    status: "progress",
    module: "Dashboard",
    updatedAt: "2025-10-12T06:41:00Z",
  },
  {
    ticketId: "TCK-1015",
    category: "Feature",
    assignedTo: {
      name: "Elena Petrova",
      image: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    title: "Role-based access for Teams",
    priorityLevel: "high",
    status: "open",
    module: "Authentication",
    updatedAt: "2025-10-12T09:59:00Z",
  },
  {
    ticketId: "TCK-1016",
    category: "Incident",
    assignedTo: {
      name: "Oluwatobi A.",
      image: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    title: "Delayed queue processing in Kafka",
    priorityLevel: "critical",
    status: "danger",
    module: "Messaging",
    updatedAt: "2025-10-12T10:44:00Z",
  },
  {
    ticketId: "TCK-1017",
    category: "Improvement",
    assignedTo: {
      name: "Maya Singh",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    title: "Sanitize user inputs for export names",
    priorityLevel: "low",
    status: "resolved",
    module: "Reports",
    updatedAt: "2025-10-09T08:10:00Z",
  },
  {
    ticketId: "TCK-1018",
    category: "Task",
    assignedTo: {
      name: "Hassan Ali",
      image: "https://randomuser.me/api/portraits/men/92.jpg",
    },
    title: "Migrate secrets to Vault",
    priorityLevel: "medium",
    status: "progress",
    module: "API",
    updatedAt: "2025-10-11T20:05:00Z",
  },
  {
    ticketId: "TCK-1019",
    category: "Bug",
    assignedTo: {
      name: "Zara Mensah",
      image: "https://randomuser.me/api/portraits/women/18.jpg",
    },
    title: "Push notifications duplicated on Android",
    priorityLevel: "high",
    status: "open",
    module: "Authentication",
    updatedAt: "2025-10-12T07:22:00Z",
  },
  {
    ticketId: "TCK-1020",
    category: "Compliance",
    assignedTo: {
      name: "Kenji Sato",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    title: "Add audit log for role edits",
    priorityLevel: "medium",
    status: "waiting",
    module: "Reports",
    updatedAt: "2025-10-08T11:36:00Z",
  },
];

export const dummyLanguages = [
  "English",
  "Spanish",
  "German",
  "Italian",
  "Mandarin",
  "Japanese",
];

export const dummyTimeZones = [
  "(UTC +2) Berlin",
  "(UTC -5) New york",
  "(UTC +9) Tokyo",
  "(UTC +3) Moscow",
  "(UTC -8) Los Angeles",
  "(UTC +10) Sydney",
];

export const dummyTicketMetrics = [
  {
    value: "2.5hrs",
    name: "Avg. resolution time",
    percentage: 21,
    icon: LOCAL_ICONS.timeIcon,

    duration: "Since Last month",
  },
  {
    value: "4.7⭐",
    name: "Avg feedback score",
    percentage: 4,
    icon: LOCAL_ICONS.starIcon,
    duration: "since last month",
  },
  {
    value: "15",
    name: "Opened tickets",
    percentage: -5,
    icon: LOCAL_ICONS.dashIcon,
    duration: "Since last month",
  },
  {
    value: "6",
    name: "Critical tickets",
    percentage: -4,
    icon: LOCAL_ICONS.warningIcon,
    duration: "Since last month",
  },
  {
    value: "5",
    name: "Overdue tickets",
    percentage: 8.4,
    icon: LOCAL_ICONS.clockIcon,

    duration: "Since last month",
  },
  {
    value: "8",
    name: "Resolved tickets",
    percentage: 24,
    icon: LOCAL_ICONS.completeIcon,
    duration: "Since last month",
  },
];
export const dummyDashboardMetrics = [
  {
    value: "65hrs",
    name: "ATotal Issues resolved",
    percentage: -12,
    icon: LOCAL_ICONS.completeIcon,
    duration: "Since Last month",
  },
  {
    value: "4.7⭐",
    name: "Avg feedback score",
    percentage: 4,
    icon: LOCAL_ICONS.starIcon,
    duration: "since last month",
  },
  {
    value: "5.2hrs",
    name: "Mean Time to Resolve (MTTR)",
    percentage: -5,
    icon: LOCAL_ICONS.timeIcon,
    duration: "Since last month",
  },

  {
    value: "1.6hrs",
    name: "Mean Time to respond (MTTRsp)",
    percentage: 8.4,
    icon: LOCAL_ICONS.timeIcon,
    duration: "Since last month",
  },
];
