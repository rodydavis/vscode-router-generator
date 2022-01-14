import * as React from "react";
import Header from "../components/Header";

export default function ProjectBase({ children }: { children?: React.ReactNode }) {
    return (
        <div>
            <Header title="Projects" />
            <section style={{
                padding: '1rem',
            }}>
                {children}
            </section>
        </div>
    );
}
