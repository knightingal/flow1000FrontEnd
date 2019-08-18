import * as React from 'react';
import {Header} from './Header';
import {SectionList, SectionBean} from './SectionList';
import {Content} from './Content';
import {Popup} from './Popup';
import './Style.css';
export interface ContainerProps {
    fetchUrl:string;
}
export class Container extends React.Component<ContainerProps, {popup: boolean ,index: string, title: string}> {
    password:string;

    notifySectionClick(selectedSection: SectionBean) {
        this.setState({
            index: selectedSection.index,
            title: selectedSection.name
        });
    }

    constructor(props: ContainerProps) {
        super(props);
        this.state = {index: "0", popup: true, title: ""};
    }

    closePopup() {
        this.setState({
            popup: false
        });
    }

    updatePassword(password: string) {
        this.password = password;
    }

    handleSectionClick(e: React.MouseEvent) {
        console.log("zz clicked");
    }

    render() {
        if (this.state.popup == true) {
            return <Popup container={this}/>
        } else {
            return <div className="RContainer" >
            <Header title={this.state.title} />
            <div className="Container">
                <Content index={this.state.index} password={this.password}/>
                <SectionList container={this} fetchUrl={this.props.fetchUrl}/>
                <div className="Right" />
            </div>
            <footer className="Footer" />
            </div>
        }
    }
}