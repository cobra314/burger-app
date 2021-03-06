import React, {Component} from 'react';

import Aux from '../../hoc/Aux2/Aux2';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-orders';

const INGREDIENTS_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}; 

class BurgerBuilder extends Component {

  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount () {
    axios.get('https://react-burger-app-5061b.firebaseio.com/ingredients.json')
      .then( response => {
        this.setState({ingredients: response.data});
      })
      .catch( error => {
        this.setState({error: true});
      });
  }

  updatePurchaseState (ingredients) {
    const sum = Object.keys(ingredients).map(
      igKey =>{
        return ingredients[igKey];
      }).reduce( (sum, el) => {
        return sum + el;
      }, 0);
    this.setState({purchasable: sum > 0});
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false });
  }

  purchaseContinueHandler = () => {
    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice.toFixed(2),
      customer: {
        name: 'David Cobra',
        zipCode: 123
      },
      deliveryMethod: 'fastest'
    };

    axios.post('/orders.json', order)
      .then( 
        response => {
        this.setState({loading: false, purchasing: false});
      })
      .catch( response => {
        this.setState({loading: false, purchasing: false});
      });
  }

  addIngredientHandler = (type) => {
    const updCount = this.state.ingredients[type] + 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updCount;
    const updPrice = this.state.totalPrice + INGREDIENTS_PRICES[type];
    this.setState({ingredients: updatedIngredients, totalPrice: updPrice});
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if( oldCount <= 0) {
      return;
    }
    const updCount = oldCount - 1;
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = updCount;
    const updPrice = this.state.totalPrice - INGREDIENTS_PRICES[type];
    this.setState({ingredients: updatedIngredients, totalPrice: updPrice});
    this.updatePurchaseState(updatedIngredients);
  }

  render(){
    const disabledInfo = {...this.state.ingredients};
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if ( this.state.ingredients ) {
      burger = (
              <Aux>
                <Burger ingredients={this.state.ingredients} />
                <BuildControls
                  purchasable={this.state.purchasable}
                  ordered={this.purchaseHandler}
                  price={this.state.totalPrice}
                  disabled={disabledInfo}
                  ingredientAdded={this.addIngredientHandler}
                  ingredientRemoved={this.removeIngredientHandler} />
              </Aux>
              );
              orderSummary = <OrderSummary 
              ingredients={this.state.ingredients} 
              purchaseCancelled={this.purchaseCancelHandler}
              purchaseContinued={this.purchaseContinueHandler} 
              price={this.state.totalPrice}/>;
    }

    if(this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

export default WithErrorHandler(BurgerBuilder, axios);
