import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import EmptyCartPage from "@/pages/shopping-view/no-items-cart";
import { useSelector } from "react-redux"; // Import useSelector to get user state

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); // Get user from Redux state

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md bg-white">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      <div className="mt-8 space-y-4">
        {user ? (
          cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <UserCartItemsContent key={item.id} cartItem={item} />
            ))
          ) : (
            <EmptyCartPage />
          )
        ) : (
          <div className="text-center">
            <p className="text-gray-500">Login to see your cart</p>
            <Button
              onClick={() => {
                navigate("/auth/login");
                setOpenCartSheet(false);
              }}
              className="mt-4"
            >
              Login
            </Button>
          </div>
        )}
      </div>

      {user && cartItems.length > 0 && (
        <>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <Button
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet(false);
            }}
            className="w-full mt-6"
          >
            Checkout
          </Button>
        </>
      )}
    </SheetContent>
  );
}

export default UserCartWrapper;
