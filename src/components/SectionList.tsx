import * as React from 'react';
import {Container} from './Container';
class SectionBean {
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
            this.sectionItemHeightStep = sectionList.map((value, index, array) => {
                return 19 * index;
            });
            this.currentTopPicIndex = 0;
            this.currentButtonPicIndex = this.checkPostionInPic(this.divRefs.current.clientHeight);

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

    currentTopPicIndex: number = null;
    currentButtonPicIndex: number = null;
    
    scrollHandler(e : React.UIEvent) {
        // this is a lazyload implament
        const scrollTop: number = (e.target as HTMLDivElement).scrollTop;
        const clientHeight: number = (e.target as HTMLDivElement).clientHeight;
        let update = false;
        // calculate the index of top picture after scroll
        const refreshTopPicIndex = this.checkPostionInPic(scrollTop);
        if (refreshTopPicIndex !== this.currentTopPicIndex) {
            this.currentTopPicIndex = refreshTopPicIndex;
            console.log(`change top to pic index: ${this.currentTopPicIndex}`);
            update = true;
        }
        // calculate the index of button picture after scroll
        const refreshButtonPicIndex = this.checkPostionInPic(scrollTop + clientHeight);
        if (refreshButtonPicIndex !== this.currentButtonPicIndex) {
            this.currentButtonPicIndex = refreshButtonPicIndex;
            console.log(`change button to pic index: ${this.currentButtonPicIndex}`);
            update = true;
        }
        // if any index of picture changed, re-render the page
        if (update) {
            this.setState(this.state);
        }
    }

    checkPostionInPic(postion: number): number {
        return this.sectionItemHeightStep.filter((height) => {
            return height < postion;
        }).length - 1;
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

    TopPadding(props:{sectionList:SectionList}) {
        let self = props.sectionList;
        if (self.sectionItemHeightStep != null && self.currentTopPicIndex != null) {
            // 这里有个bug： 滚轴滑动到最顶端时，currentTopPicIndex会=-1，这会导致sectionItemHeightStep[-1]取值异常，
            // react就不会去更新topPadding的高度，在滑动速度很快时，顶端就会留下一块空白
            // 所以这里为了修复这个问题，对currentTopPicIndex的值做了判定，<0时，topPadding高度设置为0
            if (self.currentTopPicIndex < 0) {
                return <div style={{height:"0px"}} />;
            }
            return <div style={{height:`${self.sectionItemHeightStep[self.currentTopPicIndex] - 19}px`}} />;
        }
        return null;
    }

    BottomPadding(props:{sectionList:SectionList}) {
        let self = props.sectionList;
        if (self.sectionItemHeightStep != null && self.currentButtonPicIndex != null) {
            return <div style={{height: `${self.sectionItemHeightStep[self.sectionItemHeightStep.length - 1] - self.sectionItemHeightStep[self.currentButtonPicIndex]}px`}} />;
        }
        return null;
    }

    render() {
        return <div className="SectionList" onScroll={(e) => this.scrollHandler(e)} ref={this.divRefs}>
            <this.TopPadding sectionList={this} /> {
                this.state.sectionList.map((sectionBean: SectionBean, index: number) => {
                    const displayImg = index >= this.currentTopPicIndex - 1 && index <= this.currentButtonPicIndex + 1; 
                    return displayImg ? (
                        <div 
                            key={index} 
                            onClick={(e) => this.handleSectionClick(e, sectionBean.index)} 
                        >
                            <a 
                                className="SectionListItem" 
                                style={{fontFamily:"DejaVu Sans", color:(sectionBean.index === this.state.selectedIndex ? '#35b5ff' : 'black')}}
                            >{sectionBean.name}</a>
                        </div>
                    ) : null;
                }).filter((value: JSX.Element, index: number, array: JSX.Element[]) => {
                    return value != null;
                })
            }
            <this.BottomPadding sectionList={this}/>
        </div>
    }
}