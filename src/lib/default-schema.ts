import currentDateTime from './helpers';

export const createDefaultSchema = () => {
  return {
    containers: [
      {
        created_at: currentDateTime(),
        description: 'A root of the containers\' tree',
        name: 'Root',
        parent_id: -1,
      },
    ],
    fields: [
      {
        name: "Value",
      },
      {
        name: "Text",
      },
      {
        name: "Image",
      },
      {
        name: "File",
      },
    ],
  };
};

export default createDefaultSchema;
