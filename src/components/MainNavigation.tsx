import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Library, Search, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockUser = {
  name: "Riad",
  email: "riad.test@gmail.com",
  avatar: "/avatar-placeholder.png",
};

export function MainNavigation() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-8">
        <Link
            href="/"
            className="text-xl font-semibold tracking-tight hover:text-primary transition-colors"
          >
            BookEnjoyer
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/reading-list"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Library className="h-4 w-4" />
              Reading List
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Search className="h-4 w-4" />
              Search Books
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:bg-muted"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{mockUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {mockUser.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="w-full cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="w-full cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
