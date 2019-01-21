import * as React from 'react';

interface WrappedProps<ITEM_TYPE> {
    item: ITEM_TYPE
}

function lazyLoader<ITEM_TYPE>(
    WrappedComponent: React.ComponentClass<WrappedProps<ITEM_TYPE>>, 
    itemHeightStep:Array<number>, 
    dataList:Array<ITEM_TYPE>
):React.ComponentClass<{}> {
    return class LazyLoader extends React.Component<{}, {dataList:Array<ITEM_TYPE>}> {
        constructor(props:{}) {
            super(props);
            this.itemHeightStep = itemHeightStep;
            this.state = {dataList:dataList}
        }

        itemHeightStep:Array<number>;
        currentTopPicIndex: number = null;
        currentButtonPicIndex: number = null;

        scrollHandler(e: React.UIEvent) {
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

        TopPadding(props:{self:LazyLoader}) {
            let self = props.self;
            if (self.itemHeightStep != null && self.currentTopPicIndex != null) {
                // 这里有个bug： 滚轴滑动到最顶端时，currentTopPicIndex会=-1，这会导致sectionItemHeightStep[-1]取值异常，
                // react就不会去更新topPadding的高度，在滑动速度很快时，顶端就会留下一块空白
                // 所以这里为了修复这个问题，对currentTopPicIndex的值做了判定，<0时，topPadding高度设置为0
                if (self.currentTopPicIndex < 0) {
                    return <div style={{height:"0px"}} />;
                }
                return <div style={{height:`${self.itemHeightStep[self.currentTopPicIndex] - 19}px`}} />;
            }
            return null;
        }

        checkPostionInPic(postion: number): number {
            return this.itemHeightStep.filter((height) => {
                return height < postion;
            }).length - 1;
        }

        BottomPadding(props:{self:LazyLoader}) {
            let self = props.self;
            if (self.itemHeightStep != null && self.currentButtonPicIndex != null) {
                return <div style={{height: `${self.itemHeightStep[self.itemHeightStep.length - 1] - self.itemHeightStep[self.currentButtonPicIndex]}px`}} />;
            }
            return null;
        }

        render() {
            return <div onScroll={(e)=>this.scrollHandler(e)}>
                <this.TopPadding self={this} />
                {this.state.dataList.map((itemBean:ITEM_TYPE, index: number) => {
                    const display = index >= this.currentTopPicIndex - 1 && index <= this.currentButtonPicIndex + 1;
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
    index:string;
    name:string;
    mtime:string;

    constructor(index:string, name:string, mtime:string) {
        this.index = index;
        this.name = name;
        this.mtime = mtime;
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

const sectionList:Array<SectionBean> = [
    new SectionBean("1", "1", "1"),
    new SectionBean("2", "2", "2"),
    new SectionBean("3", "3", "3"),
]


const LazyDiv = lazyLoader(WrappedDiv, [1,2,3], sectionList);