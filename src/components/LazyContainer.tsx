
import * as React from 'react';
import {LazyDiv, sectionList, HeightType, SectionBean} from './LazyLoader';
import './Style.css';

export class LazyContainer extends React.Component<{}, {sectionList: Array<SectionBean>}> {
    password:string;


    constructor(props: {}) {
        super(props);
        this.state = {
            sectionList: initSectionList(500)
        }
    }

    handleSectionClick(e: React.MouseEvent) {
        console.log("aa clicked");
        const section = new SectionBean(`500`);
        this.setState({
            sectionList: this.state.sectionList.concat(section)
        });
    }

    

    render() {
        return <div style={{height: "100%"}}>
            <div style={{height: "100%", width: "100px"}}>
                <LazyDiv dataList={this.state.sectionList} parentComp={this} scrollTop={-1}/>
            </div>
            <div style={{position: "absolute", left: "120px", top: "0px"}}
                onClick={(e) => this.handleSectionClick(e)} 
            >aa</div>
        </div>
    }
}


function initSectionList(count: number) {
    const sectionList:Array<SectionBean> = [];
    for (let i=0;i<count;i++) {
        sectionList.push(new SectionBean(`${i}`));
    }
    return sectionList;
}