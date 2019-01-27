import * as React from 'react';
import {Container} from './Container';
import {lazyLoader, HeightType, sectionList} from './LazyLoader';
class SectionBean implements HeightType{
    height:number;

    index:string;
    name:string;
    mtime:string;
    selected:boolean;
}

export class SectionList extends React.Component<{container: Container}, {sectionList:Array<SectionBean>, selectedIndex: string}> {
    url:URL;
    battleShipPage:Boolean;
    sectionItemHeightStep:Array<number> = null;
    divRefs:React.RefObject<HTMLDivElement>;
    selectedSection:SectionBean;
    constructor(props:{container: Container}) {
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
                value.height = 24;
                value.selected = false;
            })

            this.setState({
                sectionList: sectionList
            });
        });
    }

    handleSectionClick(e: React.MouseEvent, index: string) {
        this.props.container.notifySectionClick(index);
        this.setState({
            selectedIndex: index
        });
    }
    
    notifySectionClick(selectedSection:SectionBean) {
        this.props.container.notifySectionClick(selectedSection.index);
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
        const ws = new WebSocket("ws://127.0.0.1:8000/updateListenerWs");

        ws.onmessage = (event: MessageEvent) => {
            const data = event.data;
            const section: SectionBean = JSON.parse(data);
            this.setState({
                sectionList: this.state.sectionList.concat(section)
            });
        }
    }

    render() {
        return <LazyLoader dataList={this.state.sectionList} parentComp={this} />;
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

const LazyLoader = lazyLoader(SectionItem, "SectionList");