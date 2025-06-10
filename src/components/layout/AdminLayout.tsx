import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <SidebarProvider className="bg-black">
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger
          variant={"outline"}
          className="absolute z-100 m-2 h-10 w-10 bg-[#BBF429]"
        />
        {children}
      </main>
    </SidebarProvider>
  );
}
