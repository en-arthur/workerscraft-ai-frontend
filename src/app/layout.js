import "./globals.css";

export const metadata = {
  title: "WorkersCraft AI",
  description: "Build production ready web and mobile applications in minutes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-gray-100">
        {children}
      </body>
    </html>
  );
}
