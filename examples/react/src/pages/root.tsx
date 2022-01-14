import * as React from "react";

export default function Root({ children }: { children?: React.ReactNode }) {
    return (
        <main style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100vh',
        }}>
            <nav style={{
                borderRight: '1px solid #ccc',
                paddingRight: '1rem',
            }}>
                <ul>
                    <li><a href="#/">Home</a></li>
                    <li><a href="#/projects/">Projects</a></li>
                </ul>
            </nav>
            <section style={{
                flex: 1,
            }}>
                {children}
            </section>
        </main>
    );
}