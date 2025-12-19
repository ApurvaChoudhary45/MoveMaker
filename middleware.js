// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes should be protected
const isProtectedRoute = createRouteMatcher([
  "/Client/Dashboard(.*)", // Protects /Client/Dashboard and all its sub-routes
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect(); // Redirects to /sign-in if not authenticated
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)", "/"], // standard Clerk matcher config
};
