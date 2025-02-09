import { Link } from "react-router-dom";
import { ShieldAlert, LogIn, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnAuthPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldAlert className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-800">
            Unauthorized Access
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Sorry, you do not have permission to access this page.
          </p>
          <ul className="text-sm text-gray-500 list-none space-y-1 mb-4">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>This area might be restricted to certain user roles.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>You may need to sign in or use different credentials.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>
                If you believe this is an error, please contact support.
              </span>
            </li>
          </ul>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-3">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/auth/login" className="flex items-center justify-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/shop/home" className="flex items-center justify-center">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
