import Link from "next/link";

export default async function PageHeader({rightMenu, leftMenu, title, showBackButton, backButtonHref}: Readonly<{rightMenu: React.ReactNode, leftMenu: React.ReactNode, title: string, showBackButton: boolean, backButtonHref: string}>) {
    return (<div className="flex w-full my-10 justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex gap-2">
            {showBackButton ? <div><Link href={backButtonHref}>Back</Link></div>: null}
            {leftMenu ? <div>{leftMenu}</div>: null}
            {rightMenu ? <div>{rightMenu}</div>: null}
        </div>
    </div>)
}