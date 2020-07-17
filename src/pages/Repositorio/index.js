import React,{useState, useEffect} from 'react';
import {FaArrowLeft} from  'react-icons/fa';
import {Container, Owner, Loading, BackBottom} from './styles';
import api from '../../services/api';


export default function Repositorio({match}){

	const [repositorio, setRepositorio] = useState({});
	const [issues, setIssues] = useState([]);
	const [loading, setloading] = useState(true);

	useEffect(()=> {
		async function laod(){
			const nomeRepo = decodeURIComponent(match.params.repositorio);

			const [repositorioData, issuesData] = await Promise.all([
				api.get(`/repos/${nomeRepo}`),
				api.get(`/repos/${nomeRepo}/issues`, {
					params:{
						state: 'open',
						per_page: 5
					}
				})
			]);

			setRepositorio(repositorioData.data);
			setIssues(issuesData.data);
			setloading(false);
		}

		laod();
	}, [match.params.repositorio]);

	if(loading){
		return(
			<Loading>
				<h1>Carregando</h1>
			</Loading>
		)
	}

	return(
		<Container>
				<BackBottom to="/">
					<FaArrowLeft color="#000" size={30}/>
				</BackBottom>
			<Owner>
				<img src={repositorio.owner.avatar_url}
					 alt={repositorio.owner.login}
					 />
				<h1>{repositorio.name}</h1>
				<p>{repositorio.description}</p>
			</Owner>

		</Container>
	)
}

