import '../scss/oink.scss';

import $ from 'jquery';
import Hammer from 'hammerjs'; // Materialize-css bug
import 'materialize-css/dist/js/materialize';

import renderApp from './components/index';

$(() => {
  renderApp();
  $('.button-collapse').sideNav();
});
