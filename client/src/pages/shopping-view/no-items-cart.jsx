import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EmptyCartPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <ShoppingCart className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">
            Your Cart is Empty
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Looks like you have not added any items to your cart yet.
          </p>
          <ul className="text-sm text-gray-500 list-none space-y-1 mb-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Browse our categories and discover our best deals!</span>
            </li>

            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check out our latest promotions and seasonal offers.</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link
              to="/shop/listing"
              className="flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
