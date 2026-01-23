import type { Metadata } from "next";
import "./globals.scss";
import RecoilRootProvider from "../components/RecoilRootProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Script from "next/script";

declare global {
  interface Window {
    naver: any;
  }
}

export const metadata: Metadata = {
  title: "사역자모아",
  description: "사역자모아는 사역에 관련한 모든 정보를 공유하는 플랫폼입니다.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    title: "사역자모아",
    description: "사역자모아는 사역자에 관련한 모든 정보를 공유하는 플랫폼입니다.",
    url: "https://www.ministermore.co.kr/",
    images: [
      {
        url: "https://www.ministermore.co.kr/images/main.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RecoilRootProvider>
          <Header />
          {children}
          <Footer />
        </RecoilRootProvider>
        <Script type="text/javascript"
          src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=3t8vhilfqg"
        ></Script>
      </body>
    </html>
  );
}
