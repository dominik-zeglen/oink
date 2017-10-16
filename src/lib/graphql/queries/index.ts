import container from "./container";
import field from './field';

export default ((db) => {
  return {
    ...field(db),
    ...container(db),
  };
});
