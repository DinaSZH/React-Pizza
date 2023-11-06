import React, { useRef } from "react"
import axios from "axios";
import qs from 'qs'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import PizzaBlock from '../components/PizzaBlock';
import Sort, { sortList } from '../components/Sort';
import Categories from '../components/Categories';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";
import { SearchContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";

export const Home = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const {categoryId, sort, currentPage} = useSelector((state) => state.filter)

    const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
    const [orderSort, setOrderSort] = useState('asc')

    const {search} = React.useContext(SearchContext)


    const onChangeCategory = (id) => {
        dispatch(setCategoryId(id))
    }

    const onChangePage = (number) => {
        dispatch(setCurrentPage(number))
    }

    const fetchPizzas = () => {
        setIsLoading(true)
          const category = categoryId > 0 ? `category=${categoryId}` : ''; 
          const searchValue = search ? `&search=${search}` : ''; 

          axios.get(`https://652e5acf0b8d8ddac0b13a33.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sort.sortProperty}&order=${orderSort}${searchValue}`)
          .then((res) => {
            setItems(res.data);
            setIsLoading(false)
          })
      }

    // если изменили параметры и был первый рендер
      useEffect(() => {
        if (isMounted.current){
          const queryString = qs.stringify({
            sortProperty: sort.sortProperty,
            categoryId,
            currentPage,
            orderSort
          })
          
          navigate(`?${queryString}`)
        }
        isMounted.current = true;
     }, [categoryId, sort, orderSort, currentPage])
  
       // если был первый рендер, то проверяем URL-параметры и сохраняем в редаксе
  useEffect(() => {
    if(window.location.search){
      const params = qs.parse(window.location.search.substring(1))
      
      const sort = sortList.find(obj => obj.sortProperty === params.sortProperty);
      
      dispatch(
        setFilters({
          ...params,
          sort
        })
      )
      isSearch.current = true;
    }
  }, [])
   
  // если был первый рендер то запрашиваем пиццы
  useEffect(() => {
      window.scrollTo(0,0);

      if(!isSearch.current){
        fetchPizzas();
      }

      isSearch.current = false;
   }, [categoryId, sort, orderSort, search, currentPage])

   

   const pizzas = items.map((obj) => (
    <PizzaBlock key={obj.id} {...obj} />
    ));

  const skeletons = [...new Array(6)].map((_, index)=> <Skeleton key={index}/>);

    return(
            <div className="container">
            <div className="content__top">
            <Categories value={categoryId} onClickCategory={onChangeCategory}/>
            <Sort orderSort={orderSort} onClickOrder={(i) => setOrderSort(i)}  />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            <div className="content__items">
            {isLoading ? skeletons
            : pizzas}
            </div>
            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    )
}

export default Home;