import { useLocation, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FailOrder() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const error = searchParams.get("error") || "An unknown error occurred";

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Oops! Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            We encountered an error while processing your request.
          </p>
          <div className="text-sm text-gray-700 p-3 bg-red-50 rounded-md border border-red-200">
            <p className="font-semibold">Error details:</p>
            <p>{decodeURIComponent(error)}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/shop/home">Return to Home</Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/shop/listing">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
