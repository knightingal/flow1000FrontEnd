import * as React from 'react';
import {Container} from './Container';

export class Popup extends React.Component<{container: Container}, {transform:string}> {

    password:string;

    constructor(props: {container: Container}) {
        super(props);
        this.password = "";
        this.state = {
            transform: 'translate(-50%, -50%) scale(0.5)',
        }
    }

    handleDivClick(e: React.MouseEvent) {
        this.props.container.updatePassword(this.password);
        this.props.container.closePopup();
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.password = e.target.value;
    }

    componentDidMount() {
        setInterval(() => this.popup(), 1);
    }

    popup() {
        this.setState({
            transform:'translate(-50%, -50%)'
        });
    }

    render() {
        return (
            <div style={{
                height:"100%",
                width:"100%",
                backgroundColor:"lightgray"
            }}>
            <div style={{
                position: 'absolute', 
                top:'50%', 
                left:'50%', 
                transform: this.state.transform,
                textAlign: 'center', 
                padding:'16px',
                paddingRight:'20px', 
                width:'230px',
                transition:'all 0.1s linear',
                borderStyle: "solid",
                borderWidth: "2px",
                borderColor: "white",
                backgroundColor:"white"
            }}>
                <div 
                    style={{
                    }}
                >
                    <label 
                        style={{
                            height:'19px',
                            fontSize:'16px',
                            fontFamily:'DejaVu Sans',
                            display:'block'
                        }}
                    >Password</label>
                </div>
                <div>
                    <input 
                        type="password" 
                        style={{
                            width:"100%", 
                            height:'19px',
                            outline:"none", 
                            padding:"1px", 
                            border:"1px", 
                            borderStyle:"solid", 
                            borderColor:"white",
                            marginTop: '8px',
                            marginBottom: '8px',
                            backgroundColor:"whitesmoke"
                        }} 
                        onChange={(e) => this.handleChange(e)}
                    />
                </div>
                <div>
                    <input 
                        type="submit" 
                        value='OK' 
                        onClick={(e) => this.handleDivClick(e)} 
                        style={{
                            border:"0px",
                            background:"center center",
                            color:"#35b5ff",
                            fontSize: '16px',
                            fontFamily:'DejaVu Sans',
                        }}
                    />
                </div>
            </div>
            </div>
        ) ;
    }
}