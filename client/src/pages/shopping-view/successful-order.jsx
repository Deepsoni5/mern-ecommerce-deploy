import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SuccessfulOrderPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const orderId = searchParams.get("orderId");
  const date = searchParams.get("date");
  const total = searchParams.get("total");

  // Format the date
  const formattedDate = date
    ? new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  // Format the total
  const formattedTotal = total ? ` ₹${parseFloat(total).toFixed(2)}` : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            Order Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">Order ID:</span>{" "}
              {orderId || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {formattedDate}
            </p>
            <p>
              <span className="font-semibold">Total:</span> {formattedTotal}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/shop/account">View Orders</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
