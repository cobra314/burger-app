import React from 'react';

import Aux from '../../../hoc/Aux2';

const OrderSummary = (props) => {
  const ingredientsSummary = Object.keys(props.ingredients).map(
    igKey => {
      return (<li>
                <span style={{textTransform: 'capitalize'}}>{igKey}: </span>
                  {props.ingredients[igKey]}
              </li>);
  });

  return(
    <Aux>
      <h3>Your Order</h3>
      <p> a delicious burger with the following ingredients:</p>
      <ul>
        {ingredientsSummary}
      </ul>
      <p>continue to checkout?</p>
    </Aux>
  );
};

export default OrderSummary;
