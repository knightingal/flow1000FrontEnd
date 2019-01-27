import * as React from 'react';
import {Container} from './Container';
import {lazyLoader, HeightType, sectionList} from './LazyLoader';
class SectionBean implements HeightType{
    height:number;

    index:string;
    name:string;
    mtime:string;
}

export class SectionList extends React.Component<{container: Container}, {sectionList:Array<SectionBean>, selectedIndex: string}> {
    url:URL;
    battleShipPage:Boolean;
    sectionItemHeightStep:Array<number> = null;
    divRefs:React.RefObject<HTMLDivElement>;

    constructor(props:{container: Container}) {
        super(props);
        this.state = {sectionList:[], selectedIndex: null};
        this.url = new URL(document.URL);
        this.battleShipPage = this.url.pathname.indexOf("battleships.html") >= 0;
        this.divRefs = React.createRef();
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
        return <LazyLoader dataList={this.state.sectionList} />;
    }
}


class SectionItem extends React.Component<{item:SectionBean}> {
    constructor(props:{item:SectionBean}) {
        super(props);
    }

    render() {
        return <div>
            <a 
                className="SectionListItem" 
                style={{fontFamily:"DejaVu Sans"}}
            >{this.props.item.name}</a>
        </div>
    }
}

const LazyLoader = lazyLoader(SectionItem, "SectionList");