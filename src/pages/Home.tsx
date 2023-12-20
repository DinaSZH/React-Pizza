import React, { useRef } from "react"
import qs from 'qs'
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import PizzaBlock from '../components/PizzaBlock';
import Sort, { sortList } from '../components/Sort';
import Categories from '../components/Categories';
import { Skeleton } from '../components/PizzaBlock/Skeleton';
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";
import { fetchPizzas } from "../redux/slices/pizzasSlice";

export const Home: React.FC = () => {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const {items, status} = useSelector((state) => state.pizza)
  const {categoryId, sort, currentPage, search} = useSelector((state) => state.filter)

 
    const [orderSort, setOrderSort] = useState('asc')


    const onChangeCategory = (idx: number) => {
        dispatch(setCategoryId(idx))
    }

    const onChangePage = (page: number) => {
        dispatch(setCurrentPage(page))
    }

    const getPizzas = async () => {
          const category = categoryId > 0 ? `category=${categoryId}` : ''; 
          const searchValue = search ? `&search=${search}` : ''; 
          
              dispatch(
                // @ts-ignore
                fetchPizzas({
                category, 
                searchValue, 
                orderSort, 
                currentPage, 
                sortBy: sort.sortProperty,
              }))
        
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
        getPizzas();
      }

      isSearch.current = false;
   }, [categoryId, sort, orderSort, search, currentPage])

   

   const pizzas = items.map((obj: any) => (
    <Link key={obj.id} to={`/pizza/${obj.id}`}>
      <PizzaBlock  {...obj} />
    </Link>
    
    ));

  const skeletons = [...new Array(6)].map((_, index)=> <Skeleton key={index}/>);

    return(
            <div className="container">
            <div className="content__top">
            <Categories value={categoryId} onClickCategory={onChangeCategory}/>
            <Sort orderSort={orderSort} onClickOrder={(i: string) => setOrderSort(i)}  />
            </div>
            <h2 className="content__title">Все пиццы</h2>
            
            {status === 'error' ? (
              <div className="content__error-info">
                <h2>Произошла ошибка 😕</h2>
                <p>К сожалению, не удалось получить питцы. Попробуйте повторить попытку позже.</p>
              </div>
            ) : (
              <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
            )}

            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    )
}

export default Home;