import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { routeAccessMap } from './lib/settings';
import { NextResponse } from 'next/server';

// creating matchers for each route to check user roles
const matchers = Object.keys(routeAccessMap).map(route => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccessMap[route],
}));

export default clerkMiddleware(async (auth, req) => {
  // user session data
  const { sessionClaims } = await auth();

  // extracting user role
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // checking if user has permission to access the route
  for (const { matcher, allowedRoles } of matchers) {
    if (matcher(req) && !allowedRoles.includes(role!)) {
      return NextResponse.redirect(new URL(`/${role}`, req.url));
    }
  }
});

// config for which routes the middleware should run on
export const config = {
  matcher: [
    // skipping next.js internal routes and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // always running on api routes
    '/(api|trpc)(.*)',
  ],
};
