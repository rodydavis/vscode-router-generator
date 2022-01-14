import * as React from "react";

export function loader(route: string, args: { [key: string]: any }) {
    return [
        {
            id: '1',
            name: 'Project 1',
        },
        {
            id: '2',
            name: 'Project 2',
        }
    ];
}

export default function ProjectList({ data, children }: { data: Project[], children?: React.ReactNode }) {
    const projects = data;
    return (
        <div>
            <h3>Projects</h3>

            <ul >
                {projects.map(project => (
                    <li key={project.id} >
                        <a href={`#/projects/${project.id}`}>{project.name}</a>
                    </li>
                ))}
            </ul>

            {children}
        </div>
    );
}

interface Project {
    id: string;
    name: string;
}
