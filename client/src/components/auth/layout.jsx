import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left side with image */}
      <div className="hidden lg:flex items-center justify-center bg-white w-1/2 px-12">
        <img src="/logo.jpg" alt="Raj Telecom" className="max-w-full h-auto" />
      </div>

      {/* Right side with the Outlet */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
