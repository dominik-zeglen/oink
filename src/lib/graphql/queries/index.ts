import field from './field';

export default ((db) => {
  return {
    ...field(db),
  };
});
