import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request :NextRequest) {
  let supabaseResponse = NextResponse.next({
    request, // does this mean 'is request ka response hai'
    // Passing { request } ties this response to the current request context
  });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll(); // in cookies mein aur cookie store mein kya farq hai?
        },
        setAll(cookiesToSet) {
          // request ke alag set kiye, then wo request supabaseResponse ko di, and then supabaseResponse ke alag set kiye

          // first write to request.cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          ); // options nahi?

          // options dontmatter, request is already in flight
          // we trynna send these cookies to supabase

          // recreate response after that patching so new response is aligned with the new request
          supabaseResponse = NextResponse.next({
            request,
          });
          // now write the cookie stuff in this response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const public_routes = ["/", "/login", "/auth", "/error"];
  if (
    !user &&
    !public_routes.some(path => request.nextUrl.pathname.startsWith(path))
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Returning the exact supabaseResponse guarantees any cookies Supabase set are the ones the browser receives.
  return supabaseResponse;
}

// Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: DO NOT REMOVE auth.getUser()

