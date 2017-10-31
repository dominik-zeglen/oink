import $ from 'jquery';
import Hammer from 'hammerjs'; // Materialize-css bug
import 'materialize-css/dist/js/materialize';

import renderApp from './components';

$(() => {
  renderApp();
  $('.button-collapse').sideNav();
});
