import { shoppingViewHeaderMenuItems } from "@/config";
import { Label } from "../ui/label";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  HousePlug,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserCircle,
  UserCog,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import {
  clearCart,
  fetchCartItems,
  fetchGuestCartDetails,
} from "@/store/shop/cart-slice";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [currentCartItems, setCurrentCartItems] = useState([]);
  const [localCart, setLocalCart] = useState([]);
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    dispatch(clearCart());
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user?.id));
    } else {
      // Guest user: fetch cart from localStorage & get product details
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (storedCart.length > 0) {
        dispatch(fetchGuestCartDetails(storedCart));
      }
    }
  }, [dispatch, user?.id, location.pathname]);

  // Add this to see when cartItems updates

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6 rounded-lg" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {(user ? cartItems?.items?.length : cartItems?.length) || ""}
          </span>
          <span className="sr-only">User Cart</span>
        </Button>
        <UserCartWrapper
          cartItems={user?.id ? cartItems.items : cartItems}
          setOpenCartSheet={setOpenCartSheet}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black cursor-pointer">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user ? (
                user?.userName[0].toUpperCase()
              ) : (
                <UserCircle className="w-6 h-6" />
              )}
              {/* Show initial if logged in, otherwise guest icon */}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56 bg-white">
          {user ? (
            <>
              <DropdownMenuLabel>
                Logged in as {user?.userName}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/shop/account")}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer flex items-center justify-center"
              onClick={() => navigate("/auth/login")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Login to see your account
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const { cartItems } = useSelector((state) => state.shopCart);

  const [localCart, setLocalCart] = useState([]);
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    if (user?.id) {
      // Logged-in user: fetch cart from backend

      dispatch(fetchCartItems(user?.id));
    } else {
      // Guest user: fetch cart from localStorage & get product details
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      if (storedCart.length > 0) {
        dispatch(fetchGuestCartDetails(storedCart));
      }
    }
  }, [dispatch, user?.id, location.pathname]);

  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-none bg-white shadow-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Raj Telecom</span>
        </Link>
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            onClick={() => navigate("/shop/search")}
            variant="outline"
            size="icon"
            className="relative"
          >
            <Search className="w-6 h-6" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative"
          >
            <ShoppingCart className="w-6 h-6 rounded-lg" />
            <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
              {(user ? cartItems?.items?.length : cartItems?.length) || ""}
            </span>
            <span className="sr-only">User Cart</span>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Header Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-white">
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>

      <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
        <SheetContent>
          <UserCartWrapper
            cartItems={user ? cartItems?.items : cartItems}
            setOpenCartSheet={setOpenCartSheet}
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}

export default ShoppingHeader;
