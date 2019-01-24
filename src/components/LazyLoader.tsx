import * as React from 'react';

interface WrappedProps<ITEM_TYPE> {
    item: ITEM_TYPE
}

interface LazyState {
    currentTopPicIndex:number; 
    currentButtonPicIndex:number;
}

interface LazyProps<ITEM_TYPE> {
    dataList:Array<ITEM_TYPE>;
}

function lazyLoader<ITEM_TYPE>(
    WrappedComponent: React.ComponentClass<WrappedProps<ITEM_TYPE>>, 
    itemHeightStep:Array<number> 
):React.ComponentClass<LazyProps<ITEM_TYPE>> {
    return class LazyLoader extends React.Component<LazyProps<ITEM_TYPE>, LazyState> {
        constructor(props:LazyProps<ITEM_TYPE>) {
            super(props);
            this.itemHeightStep = itemHeightStep;
            this.state = {
                currentButtonPicIndex:null,
                currentTopPicIndex:null,
            };

            this.divRefs = React.createRef();
        }

        divRefs:React.RefObject<HTMLDivElement>;
        itemHeightStep:Array<number>;

        scrollHandler(e: React.UIEvent) {
            const scrollTop: number = (e.target as HTMLDivElement).scrollTop;
            const clientHeight: number = (e.target as HTMLDivElement).clientHeight;
            // calculate the index of top picture after scroll
            const refreshTopPicIndex = this.checkPostionInPic(scrollTop);

            if (refreshTopPicIndex !== this.state.currentTopPicIndex) {
                this.setState({currentTopPicIndex: refreshTopPicIndex});
                console.log(`change top to pic index: ${this.state.currentTopPicIndex}`);
            }
            // calculate the index of button picture after scroll
            const refreshButtonPicIndex = this.checkPostionInPic(scrollTop + clientHeight);
            if (refreshButtonPicIndex !== this.state.currentButtonPicIndex) {
                this.setState({currentButtonPicIndex:refreshButtonPicIndex}) ;
                console.log(`change button to pic index: ${this.state.currentButtonPicIndex}`);
            }
        }

        TopPadding(props:{self:LazyLoader}) {
            let self = props.self;
            if (self.itemHeightStep != null && self.state.currentTopPicIndex != null) {
                // 这里有个bug： 滚轴滑动到最顶端时，currentTopPicIndex会=-1，这会导致sectionItemHeightStep[-1]取值异常，
                // react就不会去更新topPadding的高度，在滑动速度很快时，顶端就会留下一块空白
                // 所以这里为了修复这个问题，对currentTopPicIndex的值做了判定，<0时，topPadding高度设置为0
                if (self.state.currentTopPicIndex < 0) {
                    return <div style={{height:"0px"}} />;
                }
                return <div style={{height:`${self.itemHeightStep[self.state.currentTopPicIndex] - 19}px`}} />;
            }
            return null;
        }

        checkPostionInPic(postion: number): number {
            return this.itemHeightStep.filter((height) => {
                return height < postion;
            }).length - 1;
        }

        componentDidMount() {
            this.setState({
                currentTopPicIndex:0,
                currentButtonPicIndex:this.checkPostionInPic(this.divRefs.current.clientHeight),
            });
        }

        BottomPadding(props:{self:LazyLoader}) {
            let self = props.self;
            if (self.itemHeightStep != null && self.state.currentButtonPicIndex != null) {
                return <div style={{height: 
                    `${self.itemHeightStep[self.itemHeightStep.length - 1] - self.itemHeightStep[self.state.currentButtonPicIndex]}px`}} />;
            }
            return null;
        }

        render() {
            return <div onScroll={(e)=>this.scrollHandler(e)} ref={this.divRefs} style={{height:"100%", overflowY:"scroll"}}>
                <this.TopPadding self={this} />
                {this.props.dataList.map((itemBean:ITEM_TYPE, index: number) => {
                    const display = index >= this.state.currentTopPicIndex - 1 && index <= this.state.currentButtonPicIndex + 1;
                    return display ?
                    (<WrappedComponent key={index} item={itemBean} />)
                    : null;
                }).filter((value: JSX.Element, index: number, array: JSX.Element[]) => {
                    return value != null;
                })}
                <this.BottomPadding self={this} />
            </div>
        }
    }
}

class SectionBean {
    name:string;

    constructor(name:string) {
        this.name = name;
    }
}

class WrappedDiv extends React.Component<{item:SectionBean}> {
    constructor(props:{item:SectionBean}) {
        super(props);
    }

    render() {
        return <div>
            <a style={{fontFamily:"DejaVu Sans"}} >
            {this.props.item.name}
            </a>
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
export const sectionList:Array<SectionBean> = initSectionList(500);

const gItemHeightStep = sectionList.map((value, index, array) => {
    return 19 * index;
});


export const LazyDiv = lazyLoader(WrappedDiv, gItemHeightStep);