import { Global, css } from '@emotion/react'

const style = css`
    @import url(https://cdn.jsdelivr.net/gh/moonspam/NanumSquare@1.0/nanumsquare.css);
    * {
        box-sizing: border-box;
    }
    html,
    body {
        padding: 0;
        margin: 0;
        font-family: 나눔스퀘어, 'NanumSquare', sans-serif;
    }
    .reg {
        font-weight: 400;
    }
    .bold {
        font-weight: 700;
    }
    .exb {
        font-weight: 800;
    }
    .light {
        font-weight: 300;
    }

    select,
    input,
    button,
    textarea {
        border: 0;
        outline: 0 !important;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    .fade-enter {
        opacity: 0;
    }
    .fade-enter-active {
        opacity: 1;
        transition: opacity 1s ease-in-out;
    }
    .fade-exit {
        opacity: 1;
    }
    .fade-exit-active {
        opacity: 0;
        transition: all 0.75s;
    }

    .checkbox_grid {
        display:grid;
        gap:10px;
        grid-template-columns:80px repeat(auto-fit, minmax(80px, 1fr));
        margin-top:5px;
    }
    .checkbox_grid.type02 {
        grid-template-columns: repeat(2, 1fr);
    }
    .checkbox_flex {
        display:flex;
        gap:10px;
        flex-wrap:wrap;
        margin-top:5px;
    }
    .checkbox_flex > div:first-of-type {
        width:80px;
    }
    .checkbox_flex .custom_check + label {
        padding:0 20px;
    }
    .custom_check {
        display:none;
    }
    .custom_check + label {
        display:block;
        width:100%;
        border-radius:8px;
        height:45px;
        line-height:45px;
        border:1px solid rgb(230,232,240);
        text-align:center;
        color:rgb(102,102,102);
        cursor:pointer;
    }
    .custom_check:checked + label {
        border:1px solid #1f296a;
        color:#1f296a
    }

    .graph_wrap {
        display:flex;
        flex-direction:row-reverse;
        justify-content:space-between;
        gap:10px;
    }
    .graph_box {
        position:relative;
        width:100%;
        padding-bottom:50%;
    }
    .graph_box .graph {
        position:absolute;
        left:0; top:0;
        width:100%;
        height:100%;
    }
    .graph_box .graph > div:first-of-type,
    .graph_box .graph > div canvas {
        width:100% !important;
        height:100% !important;
    }
    @media all and (max-width:767px){
        .graph_wrap {
            flex-direction:column
        }
    }

`

const GlobalStyle = () => {
    return <Global styles={style} />
}

export default GlobalStyle
