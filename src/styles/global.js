import {createGlobalStyle} from 'styled-components';

export default createGlobalStyle`
	*{
		margin:0;
		padding: 0;
		outline:0;
		box-sizing: border-box;	
	}
	hmtl,body, #root{
		min-height: 100%;
	}

	body{
		background: #0D2636;
		font-size: 14px;
		-web-font-smoothing: antialiased !important;
	}

	body,input, button{
		color: #222;
		font-size:14px;
		font-family: Arial
	}

	button{
		cursor: pointer;
	}
`;

