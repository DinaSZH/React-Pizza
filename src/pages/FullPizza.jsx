import axios from 'axios';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const FullPizza = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = useState();

  useEffect(() => {
    async function fetchPizza() {
      try {
        const {data} = await axios.get('https://652e5acf0b8d8ddac0b13a33.mockapi.io/items/' + id);
        setPizza(data);
      } catch (error) {
        alert('Ошибка при получении пиццы');
        navigate('/');
      }
    }
    
    fetchPizza();
  }, []);

  if (!pizza) {
    return <>Загрузка...</>;
  }


  return (
     <div className="container">
      <img src={pizza.imageUrl} />
      <h2>{pizza.title}</h2>
      <h4>{pizza.price} ₽</h4>
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  )
}

export default FullPizza
