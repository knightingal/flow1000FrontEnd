import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Container} from './components/Container';

console.log("battleship.tsx")
ReactDOM.render(
    <Container fetchUrl="/local1000/picIndexAjax?album=BattleShips"/>,
    document.getElementById('root')
)