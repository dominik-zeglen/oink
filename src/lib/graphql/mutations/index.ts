import containerMutation from "./container";
import moduleMutation from "./module";
import objectMutation from "./object";

export default ((db) => {
  return {
    ...containerMutation(db),
    ...moduleMutation(db),
    ...objectMutation(db),
  };
});
