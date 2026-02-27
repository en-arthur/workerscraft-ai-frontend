import "./globals.css";

export const metadata = {
  title: "WorkersCraft AI",
  description: "Build production ready web and mobile applications in minutes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
