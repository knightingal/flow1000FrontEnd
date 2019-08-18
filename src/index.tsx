import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from './components/Container';

console.log("index.tsx")
ReactDOM.render(
    <Container fetchUrl="/local1000/picIndexAjax/"/>,
    document.getElementById('root')
)