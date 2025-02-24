import { Outlet, Link } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with image */}
      <div className="hidden lg:flex items-center justify-center bg-white w-1/2 px-12">
        <img src="/logo.jpg" alt="Raj Telecom" className="max-w-full h-auto" />
      </div>

      {/* Right side with the Outlet */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />

        {/* Back to Shop/Home Link */}
        <Link
          to="/shop/home"
          className="mt-6 text-blue-600 underline text-sm hover:text-blue-800"
        >
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
}

export default AuthLayout;
