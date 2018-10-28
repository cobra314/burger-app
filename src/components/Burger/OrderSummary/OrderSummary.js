import React from 'react';

import Aux from '../../../hoc/Aux2';
import Button from '../../UI/Button/Button';

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
      <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
      <p>continue to checkout?</p>
      <Button btnType="Danger" clicked={props.purchaseCancelled}>CANCEL</Button>
      <Button btnType="Success" clicked={props.purchaseContinued}>CONTINUE</Button>
    </Aux>
  );
};

export default OrderSummary;
