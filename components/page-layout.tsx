export default async function PageLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (<div className="container my-10">{children}</div>)
}