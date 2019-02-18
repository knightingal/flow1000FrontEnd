import * as React from 'react';
import {ImgComponent} from './ImgComponent';
import {lazyLoader, HeightType, sectionList, LazyProps} from './LazyLoader';
class SectionDetail {
    dirName:string;
    picPage:string;
    pics:Array<ImgDetail>;

    constructor() {
        this.dirName = "";
        this.picPage = "";
        this.pics = [];
    }
}

class ImgDetail implements HeightType{
    name:string;
    width:number;
    height:number;

    constructor(name:string, width:number, height:number) {
        this.name = name;
        this.width = width;
        this.height = height;
    }
}

export class Content extends React.Component<{index:string, password:string}, {sectionDetail:SectionDetail}> {
    constructor(props:{index: string, password:string}) {
        super(props);
        this.state = {sectionDetail: new SectionDetail()};
    }

    fecthSectionList(index: string) {
        if (index === "0") {
            return;
        }
        fetch(`/local1000/picDetailAjax?id=${index}`)
        .then((resp: Response) => {
            return resp.json();
        })
        .then((json: any) => {
            const sectionDetail:SectionDetail = json;
            this.setState({
                sectionDetail:sectionDetail
            });
        });
    }

    componentDidMount() {
        this.fecthSectionList(this.props.index);        
    }


    componentDidUpdate(prevProps: {index:string}) {
        if (this.props.index !== prevProps.index) {
            this.fecthSectionList(this.props.index);        
        }

    }

    render() {
        return <LazyLoader dataList={this.state.sectionDetail.pics} parentComp={this} />
    }
}

class ImgComponentItem extends React.Component<{item: ImgDetail, parentComp:Content}> {
    constructor(props:{item: ImgDetail, parentComp:Content}) {
        super(props);
    }

    render() {
        return <ImgComponent 
            width={this.props.item.width} 
            height={this.props.item.height} 
            src={`/static/encrypted/${this.props.parentComp.state.sectionDetail.dirName}/${this.props.item.name}.bin`} 
            password={this.props.parentComp.props.password} 
        /> 
    }
}

const LazyLoader: 
    React.ComponentClass<
        LazyProps<
            ImgDetail, 
            {index:string, password:string}, 
            {sectionDetail:SectionDetail}, 
            Content
        >
    > 
= lazyLoader(ImgComponentItem, "Content", 2)