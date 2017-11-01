import container from "./container";
import module from './module';
import object from './object';

export default ((db) => {
  return {
    ...container(db),
    ...module(db),
    ...object(db),
  };
});
