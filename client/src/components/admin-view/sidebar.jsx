import {
  BadgeCheck,
  ChartNoAxesCombined,
  CheckCircle,
  LayoutDashboard,
  MessageSquare,
  ShoppingBasket,
  Truck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "All Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "dispatch-orders",
    label: "Dispatch Orders",
    path: "/admin/dispatch-orders",
    icon: <Truck />, // Truck icon for dispatch
  },
  {
    id: "confirm-orders",
    label: "Confirm Orders",
    path: "/admin/confirm-orders",
    icon: <CheckCircle />, // CheckCircle icon for confirmation
  },
  {
    id: "cancel-orders",
    label: "Cancel Orders",
    path: "/admin/cancel-orders",
    icon: <XCircle />, // XCircle icon for cancelled orders
  },
  {
    id: "inquiries",
    label: "Inquiries",
    path: "/admin/inquiries",
    icon: <MessageSquare />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-gray-200 hover:text-foreground"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSidebar({ open, setOpen }) {
  const navigate = useNavigate();
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="bg-white w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </>
  );
}

export default AdminSidebar;
