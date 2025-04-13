import { NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

export async function GET(){

    try {
        const authParameters = imagekit.getAuthenticationParameters()
        return NextResponse.json(authParameters);
        
    } catch (error) {
        console.error("ImageKit authentication error:", error);
        return NextResponse.json(
            { error: "Imagekit Auth Failed"},
            {status: 500}
        )
    }

}
