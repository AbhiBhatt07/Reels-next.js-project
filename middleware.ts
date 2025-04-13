import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(){
        return NextResponse.next()
    }, 
    {
        callbacks: {
            authorized: ({token, req}) => {
                const {pathname} = req.nextUrl;

                // allow only for auth related routes.

                if (
                    pathname.startsWith("/api/auth") ||
                    pathname === "/login" ||
                    pathname === "/register"
                ){
                    return true
                }

                // for public routes access is allow

                if(pathname === "/" || pathname.startsWith("/api/videos")){
                    return true
                }

                return !!token
            }
        }
    }
)

export const config = {
    matcher: ["/((?!_next/static|_next/images|favicon.ico|public/).*)"],
};