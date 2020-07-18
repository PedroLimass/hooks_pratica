import React,{useState, useEffect} from 'react';
import {FaArrowLeft} from  'react-icons/fa';
import {Container, Owner, Loading, BackBottom, IssuesList, PageAction, FilterLists} from './styles';
import api from '../../services/api';


export default function Repositorio({match}){

	const [repositorio, setRepositorio] = useState({});
	const [issues, setIssues] = useState([]);
	const [loading, setloading] = useState(true);
	const [page, setPage] = useState(1);
	const [filters,setFilters] = useState([
			{state: 'all', label: 'Todas', active: true},
			{state: 'open', label: 'Abertas', active: false},
			{state: 'closed', label: 'Fechado', active: false},
		]);
	const [filterIndex, setFilterIndex] = useState(0);

	useEffect(()=> {
		async function laod(){
			const nomeRepo = decodeURIComponent(match.params.repositorio);

			const [repositorioData, issuesData] = await Promise.all([
				api.get(`/repos/${nomeRepo}`),
				api.get(`/repos/${nomeRepo}/issues`, {
					params:{
						state: filters.find(f => f.active).state, //filter play here
						per_page: 5
					}
				})
			]);

			setRepositorio(repositorioData.data);
			setIssues(issuesData.data);
			console.log(issuesData.data);

			setloading(false);
		}

		laod();
	}, [match.params.repositorio]);

	useEffect(()=>{
		async function loadIssue(){
			const nomeRepo = decodeURIComponent(match.params.repositorio);

			const response = await api.get(`/repos/${nomeRepo}/issues`, {
				params:{
					state: filters[filterIndex].state,
					page,
					per_page: 5,
				},
			});

			setIssues(response.data);
		}

		loadIssue();

	}, [match.params.repositorio, page, filterIndex,filters]);

	function handlePage(action){
		setPage(action === 'back' ? page - 1 : page + 1)
	}

	function handleFilter(index){
		setFilterIndex(index);
	}



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

			<FilterLists active={filterIndex}>
				{filters.map((filter, index) => (
					<button type="button" key={filter.label}
					onClick={()=>handleFilter(index)}>
						{filter.label}
					</button>
				))}
			</FilterLists>

			<IssuesList>
				{issues.map(issue => (
					<li key={String(issue.id)}>
						<img src={issue.user.avatar_url} alt={issue.user.login}/>

						<div>
							<strong>
								<a href={issue.html_url}>{issue.title}</a>

								{issue.labels.map(label =>(
									<span key={String(label.id)}>{label.name}</span>
								))}

							</strong>

							<p>{issue.user.login}</p>
						</div>
					</li>
				))}
			</IssuesList>

			<PageAction>
				<button
				type="button" onClick={()=> handlePage('back')}
				disabled={page < 2}>
					Voltar
				</button>
				<button type="button" onClick={()=>handlePage('next')}>
					Proxima
				</button>
			</PageAction>

		</Container>
	)
}



