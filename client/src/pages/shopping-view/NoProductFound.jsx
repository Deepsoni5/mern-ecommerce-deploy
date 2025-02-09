import { useLocation, Link } from "react-router-dom";
import { PackageX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NoProductsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <PackageX className="h-10 w-10 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            No Products Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            We are sorry, but there are currently no products available in the{" "}
            {category ? `"${category}"` : "selected"} category.
          </p>
          <p className="text-sm text-gray-500 mb-2">This could be because:</p>
          <ul className="text-sm text-gray-500  list-none space-y-1 mb-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>The category is new and products are yet to be added</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                All products in this category are currently out of stock
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>There might be an internal error in our system</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild className="w-full sm:w-auto">
            <Link to="/" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
