import {
    Outlet,
    Link,
} from "react-router";

// Layout with common navbar
export function Layout() {
    return (
        <>
            <nav
                style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "1rem",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <Link to="/">Recommend</Link>
                <Link to="/history">History</Link>
            </nav>

            <main style={{ padding: "1rem" }}>
                <Outlet />
            </main>
        </>
    );
}