import React from 'react'
import { useState } from 'react';

type CategoriesProps = {
  value: number;
  onClickCategory: any;
};

const Categories: React.FC<CategoriesProps> = ({value, onClickCategory}) => {
  // const [activeIndex, setActiveIndex] = useState(0);

  // const activeCategory = (index) => {
  //   setActiveIndex(index)
  // }

  let categories = ["Все", "Мясные", "Вегетарианская", "Гриль", "Острые", "Закрытые"];
    return(
        <div className="categories">
            <ul>
              {categories.map((categoryName, i) => (
                <li key={i} onClick={() => onClickCategory(i)} className={value === i ? 'active' : ''}>{categoryName}</li>
              ))}
            </ul>
          </div>
    )
}

export default Categories;