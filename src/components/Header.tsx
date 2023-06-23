import Link from "next/link";

export default function Header() {
    return (
      <nav>
        <Link href="/">Dashboard</Link>
        <Link href="/accounts">Accounts</Link>
        <Link href="/expenses">Expenses</Link>
      </nav>
    );
  }