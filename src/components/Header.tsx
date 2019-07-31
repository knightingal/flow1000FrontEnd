import * as React from 'react';

export class Header extends React.Component<{title: string}, {}> {
    constructor(props: {title: string}) {
        super(props)
    }

    render() {
        return <header className="Header" >{this.props.title}</header>;
    }
}