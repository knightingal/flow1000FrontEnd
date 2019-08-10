import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {LazyContainer} from './components/LazyContainer';

console.log("lazyIndex.tsx")
ReactDOM.render(
    <LazyContainer />,
    document.getElementById('root')
)