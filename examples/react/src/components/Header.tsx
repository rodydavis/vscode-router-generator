import * as React from "react";

export default function Header({ title }: { title: string }) {
    return (
        <header style={{
            backgroundColor: '#fafafa',
            padding: '1rem',
            borderBottom: '1px solid #ccc',
            color: '#333',
        }}>
            <span className="title" style={
                {
                    fontSize: '2em',
                    fontWeight: 'bold',
                }
            }>{title}</span>
        </header>
    );
}
