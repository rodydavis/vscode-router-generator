import * as React from "react";
import Header from "../components/Header";

function UnknownRoute({ children }: { children?: React.ReactNode }) {
    return (
        <div>
            <Header title="404" />
            {children}
        </div>
    );
}

export default UnknownRoute;