import { useTheme } from "@/shared/browser/providers/theme";
import {
  Link,
  Outlet,
  useRouterState,
  createFileRoute,
} from "@tanstack/react-router";
import {
  Bell,
  CircleUser,
  LineChart,
  Menu,
  Briefcase,
  FileText,
  FileEdit,
  Moon,
  Sun,
} from "lucide-react";

import { ScrollArea } from "@/shared/browser/ui/scroll-area";
import { Badge } from "@/shared/browser/ui/badge";
import { Button } from "@/shared/browser/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/browser/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/browser/ui/dropdown-menu";
import { Input } from "@/shared/browser/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/browser/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/browser/ui/popover";
import { Avatar } from "@/shared/browser/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/shared/browser/ui/resizable";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/browser/ui/dialog";
import { AuthProvider } from "@/shared/auth/hooks";
import { Label } from "@/shared/browser/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/browser/ui/tooltip";
import { cn } from "@/shared/browser/ui/utils";
import { useAtom, atom } from "jotai";

export const Route = createFileRoute("/_home")({
  component: () => (
    <AuthProvider>
      <StaticDashboard />
    </AuthProvider>
  ),
});

const collapsedAtom = atom(false);
export function useCollapseSideNav() {
  return useAtom(collapsedAtom);
}

function DynamicDashboard() {
  const [collapsed, setCollapsed] = useCollapseSideNav();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="min-h-screen h-full w-full"
    >
      <ResizablePanel
        collapsible
        defaultSize={265}
        minSize={15}
        maxSize={20}
        collapsedSize={5}
        onExpand={() => setCollapsed(false)}
        onCollapse={() => setCollapsed(true)}
        className={cn(
          collapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out max-w-[50px] ",
          "hidden border-r bg-muted/40 md:block max-w-[200px] "
        )}
      >
        {!collapsed && <Navigation />}
        {collapsed && <CollaspedNav />}
      </ResizablePanel>
      <ResizableHandle withHandle />

      <ResizablePanel className="flex flex-col max-h-screen" defaultSize={1000}>
        <Header />
        <ScrollArea
          viewportProps={{
            style: {
              height: "100%",
              maxHeight: "calc(100vh - 56px)",
            },
          }}
        >
          <Outlet />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function StaticDashboard() {
  const [collapsed, setCollapsed] = useCollapseSideNav();

  return (
    <div className="min-h-screen h-full w-full flex">
      <nav
        className={cn(
          collapsed &&
            "min-w-[50px] transition-all duration-300 ease-in-out max-w-[50px] ",
          "hidden border-r bg-muted/40 md:block max-w-[200px] "
        )}
      >
        {!collapsed && <Navigation />}
        {collapsed && <CollaspedNav />}
      </nav>

      <div className="flex flex-col max-h-screen w-full">
        <Header />
        <ScrollArea
          viewportProps={{
            style: {
              height: "100%",
              maxHeight: "calc(100vh - 56px)",
            },
          }}
        >
          <Outlet />
        </ScrollArea>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <Navigation />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>
      <ModeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/8.x/notionists/svg?seed=Lola" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/">Logout</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function CollaspedNav() {
  const { location } = useRouterState();
  return (
    <div className="flex flex-col items-center">
      <div className="h-14 lg:h-[60px] flex justify-center border-b w-full">
        <Link to="/jobs" className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" className="h-6 w-6" />
        </Link>
      </div>
      <nav className="pt-2 flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/jobs"
              aria-selected={location.pathname === "/jobs"}
              className="flex items-center justify-center rounded-lg w-10 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
            >
              <Briefcase className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Jobs</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/applications"
              aria-selected={location.pathname === "/applications"}
              className="flex items-center justify-center rounded-lg w-10 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
            >
              <FileEdit className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Applications</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/resume"
              aria-selected={location.pathname === "/resume"}
              className="flex items-center justify-center rounded-lg w-10 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
            >
              <FileText className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Resume</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to="/analytics"
              aria-selected={location.pathname === "/analytics"}
              className="flex items-center justify-center rounded-lg w-10 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
            >
              <LineChart className="h-4 w-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Analytics</TooltipContent>
        </Tooltip>
      </nav>
    </div>
  );
}

function Navigation() {
  const { location } = useRouterState();
  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link to="/jobs" className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" className="h-6 w-6" />
          <span className="">Hevel</span>
        </Link>
        <Notifications />
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <Link
            to="/jobs"
            aria-selected={location.pathname === "/jobs"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
          >
            <Briefcase className="h-4 w-4" />
            Jobs
          </Link>
          <Link
            to="/applications/kanban"
            aria-selected={location.pathname.includes("/applications")}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
          >
            <FileEdit className="h-4 w-4" />
            Applications
            <Badge
              variant={"outline"}
              className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
            >
              0
            </Badge>
          </Link>
          <Link
            to="/resume"
            aria-selected={location.pathname === "/resume"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
          >
            <FileText className="h-4 w-4" />
            Resume
          </Link>
          <Link
            to="/analytics"
            aria-selected={location.pathname === "/analytics"}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary aria-selected:bg-muted"
          >
            <LineChart className="h-4 w-4" />
            Analytics
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <CardUpgradeToPro />
      </div>
    </div>
  );
}

function Notifications() {
  const { notifications } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="ml-auto h-8 w-8 relative"
        >
          <Bell className="h-4 w-4" />
          <Badge className="ml-auto flex shrink-0 items-center justify-center w-5 h-5 absolute -top-2 -right-2 text-xs rounded-full p-0">
            {notifications.length}
          </Badge>
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" alignOffset={4} sideOffset={4}>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 hover:bg-muted ring-muted ring-opacity-10 rounded-lg transition-all bg-muted/10"
          >
            <Bell className="h-8 w-8" />
            <div className="ml-2">
              <h3 className="text-sm font-medium">{notification?.title}</h3>
              <p className="text-xs text-muted-foreground">
                {notification?.description}
              </p>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function useNotifications() {
  return {
    notifications: [],
  };
}

function CardUpgradeToPro() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full">
              Upgrade
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upgrade to Pro</DialogTitle>
              <DialogDescription>
                Unlock all features and get unlimited access to our support
                team.
              </DialogDescription>
              <DialogClose />
            </DialogHeader>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Lee" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Robinson" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="m@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Credit card</Label>
                <Input id="card" placeholder="4242 4242 4242 4242" required />
              </div>
              <DialogFooter>
                <Button className="ml-auto" type="submit">
                  Submit
                </Button>
                <Button type="reset" variant="outline">
                  Reset
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
