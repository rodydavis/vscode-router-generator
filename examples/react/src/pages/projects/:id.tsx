import * as React from "react";

export function loader(route: string, args: { [key: string]: any }) {
    const id = args['id'];
    return {
        id: `${id}`,
        name: `Project ${id}`,
    };
}

export default function ProjectDetails({
    data,
    children,
}: {
    id: string;
    data: Project;
    children?: React.ReactNode;
}) {
    const project = data;
    return (
        <div>
            <h3>{project.name}</h3>

            {children}
        </div>
    );
}

interface Project {
    id: string;
    name: string;
}
