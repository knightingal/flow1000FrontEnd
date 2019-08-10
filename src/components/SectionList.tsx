import * as React from 'react';
import {Container} from './Container';
import {lazyLoader, HeightType, sectionList, LazyProps} from './LazyLoader';
export class SectionBean implements HeightType{
    height:number;

    index:string;
    name:string;
    mtime:string;
    selected:boolean;
}
interface SectionListProps {
    container: Container
}

interface SectionListStatus {
    sectionList:Array<SectionBean>; 
    selectedIndex: string;
}

export class SectionList extends React.Component<SectionListProps, SectionListStatus> {
    url:URL;
    battleShipPage:Boolean;
    sectionItemHeightStep:Array<number> = null;
    divRefs:React.RefObject<HTMLDivElement>;
    selectedSection:SectionBean;
    constructor(props:SectionListProps) {
        super(props);
        this.state = {sectionList:[], selectedIndex: null};
        this.url = new URL(document.URL);
        this.battleShipPage = this.url.pathname.indexOf("battleships.html") >= 0;
        this.divRefs = React.createRef();
        this.selectedSection = null;
    }

    fecthSectionList() {
        let fetchUrl:string;
        fetchUrl = this.battleShipPage ? "/local1000/picIndexAjax?album=BattleShips" : "/local1000/picIndexAjax";

        console.log("fetchUrl is " + fetchUrl);
        fetch(fetchUrl)
        .then((resp: Response) => {
            return resp.json();
        })
        .then((json: any) => {
            let sectionList:Array<SectionBean> = json;
            if (this.battleShipPage == true) {
                //sectionList.(sectionList);
                sectionList = [].concat(
                    sectionList, sectionList, sectionList, sectionList,
                    sectionList, sectionList, sectionList, sectionList,
                    sectionList, sectionList, sectionList, sectionList,
                    sectionList, sectionList, sectionList, sectionList
                );
            }
            sectionList.forEach((value:SectionBean, index:number, array:SectionBean[]) => {
                //  这里我犯了一个错误，实际上这里的div元素的高度是24，里面的a元素的高度才是19，
                // 这个错误导致后续对padding div高度计算的错误，引发了一个定位了很久的bug。
                value.height = 24;
                value.selected = false;
            })

            this.setState({
                sectionList: sectionList
            });
        });
    }

    notifySectionClick(selectedSection:SectionBean) {
        this.props.container.notifySectionClick(selectedSection);
        if (this.selectedSection != null) {
            this.selectedSection.selected = false;
        }
        selectedSection.selected = true;
        this.selectedSection = selectedSection;
        this.setState({
            sectionList:this.state.sectionList
        })
    }

    componentDidMount() {
        this.fecthSectionList();        
        const ws = new WebSocket(`ws://${this.url.hostname}/chat/`);

        ws.onmessage = (event: MessageEvent) => {
            const data = event.data;
            console.log(`onmessage: ${data}`);
            const section: SectionBean = JSON.parse(data);
            section.height = 24;
            this.setState({
                sectionList: this.state.sectionList.concat(section)
            });
        }
    }

    render() {
        return <LazyLoader dataList={this.state.sectionList} parentComp={this} scrollTop={-1}/>;
    }
}


class SectionItem extends React.Component<{item:SectionBean, parentComp: SectionList}> {
    constructor(props:{item:SectionBean, parentComp: SectionList}) {
        super(props);
    }

    handleSectionClick(e: React.MouseEvent, item: SectionBean) {
        this.props.parentComp.notifySectionClick(item);
    }

    render() {
        return <div
            onClick={(e) => this.handleSectionClick(e, this.props.item)} 
        >
            <a 
                className="SectionListItem" 
                style={{fontFamily:"DejaVu Sans", color:(this.props.item.selected? '#35b5ff' : 'black')}}
            >{this.props.item.name}</a>
        </div>
    }
}

const LazyLoader: 
    React.ComponentClass<
        LazyProps<
            SectionBean, 
            SectionListProps, 
            SectionListStatus, 
            SectionList
        >
    > 
= lazyLoader(SectionItem, "SectionList");