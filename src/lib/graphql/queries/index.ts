import container from "./container";
import field from './field';
import module from './module';
import object from './object';

export default ((db) => {
  return {
    ...field(db),
    ...container(db),
    ...module(db),
    ...object(db),
  };
});
