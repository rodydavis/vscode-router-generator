import * as React from "react";
import Header from "../components/Header";

export default function Home({ children }: { children?: React.ReactNode }) {
    return (
        <div>
            <Header title="Home" />
            {children}
        </div>
    );
}