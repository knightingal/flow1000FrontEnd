import * as React from 'react';
import {Header} from './Header';
import {SectionList, SectionBean} from './SectionList';
import {Content} from './Content';
import {Popup} from './Popup';
import {LazyDiv, sectionList} from './LazyLoader';
import './Style.css';

export class Container extends React.Component<{}, {popup: boolean ,index: string, title: string}> {
    password:string;

    notifySectionClick(selectedSection: SectionBean) {
        this.setState({
            index: selectedSection.index,
            title: selectedSection.name
        });
    }

    constructor(props: {}) {
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

    render() {
        
        const url = new URL(document.URL);
        const lazy = url.pathname.indexOf("lazy.html") >= 0;
        if (lazy === true) {
            return <LazyDiv dataList={sectionList} parentComp={this} scrollTop={0}/>
        }

        if (this.state.popup == true) {
            return <Popup container={this}/>
        } else {
            return <div className="RContainer" >
            <Header title={this.state.title} />
            <div className="Container">
                <Content index={this.state.index} password={this.password}/>
                <SectionList container={this}/>
                <div className="Right" />
            </div>
            <footer className="Footer" />
            </div>
        }
    }
}