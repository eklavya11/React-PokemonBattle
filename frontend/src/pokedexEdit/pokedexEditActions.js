import axios from 'axios'
import { toastr } from 'react-redux-toastr'
import { showTabs, selectTab } from "../common/tabs/tabActions";
import { initialize } from 'redux-form'

const BASE_URL = 'http://localhost:3003/api'
const INITIAL_VALUES = {}

export function getList(){
    const request = axios.get(`${BASE_URL}/pokemonGallery`)
    return{
        type: 'POKEMON_FETCHED',
        payload: request
    }
}

export const search = () => {
    return (dispatch, getState) =>{
        const pesquisa = getState().pokedex.search
        const search = pesquisa ? `&name__regex=/${pesquisa}/` : ''
        const request = axios.get(`${BASE_URL}/pokemonGallery?sort=-createdAt${search}`)
            .then(resp => dispatch({type: 'POKEMON_FETCHED', payload: resp}))
    }
}

export const change = e => ({
    type: 'CHANGE',
    id: e.target.id,
    payload: e.target.value
})

export function create(values){
    return submit(values, 'post')
}

export function update(values){
    return submit(values, 'put')
}

export function remove(values){
    return submit(values, 'delete')
}

export function showUpdate(pokedexEdit){
    return[
        showTabs('tabUpdate'),
        selectTab('tabUpdate'),
        initialize('pokedexEditForm', pokedexEdit)
    ]
}

export function showDelete(pokedexEdit){
    return[
        showTabs('tabDelete'),
        selectTab('tabDelete'),
        initialize('pokedexEditForm', pokedexEdit)
    ]
}

function submit(values, method){
    const id = values._id ? values._id : ''
    return dispatch => {
        axios[method](`${BASE_URL}/pokemonGallery/${id}`, values)
            .then(resp => {
                toastr.success('Sucesso', 'Operação realizada com sucesso')
                dispatch(init())
            })
            .catch(e => {
                e.response.data.errors.forEach(error => toastr.error('Erro', error))
            })
    }
}

export function init(){
    return [
        showTabs('tabList', 'tabCreate'),
        selectTab('tabList'),
        getList(),
        initialize('pokedexEditForm', INITIAL_VALUES)
    ]
}

export function searchProfile(id = ''){
    const request = axios.get(`${BASE_URL}/PokemonGallery${id ? `/${id}` : '?skip=0&limit=1'}`)
    return{
        type: 'PROFILE_SEARCHED',
        payload: request
    }
}
