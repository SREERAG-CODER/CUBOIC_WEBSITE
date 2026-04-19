import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Space App",
    description: "A cosmic experience",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0, background: "#000", overflow: "hidden" }}>
                {children}
            </body>
        </html>
    );
}