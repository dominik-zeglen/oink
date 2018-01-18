import React from 'react';

class ImageField extends React.Component {
  constructor(props) {
    super(props);
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }

  onFileInputChange(e) {
    // const addFileModal = $('#add-file-modal');
    const imagePath = e.target.value;
    addFileModal.modal('open');
    const formData = (new FormData());
    formData.append('image', e.target.files[0]);
    formData.append('user', 'me');
    fetch(`/manage/rest/upload-image/${this.props.objectId}/${this.props.fieldId}`, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      addFileModal.modal('close');
      const fileName = `${this.props.objectId}_${this.props.fieldId}.${imagePath.split('.').splice(-1)}`;
      this.props.onUpload(this.props.fieldId, `${fileName}`);
    }).catch(e => console.log(e));
  }

  render() {
    return (
      <div className="file-field input-field">
        <div className="btn">
          <span>File</span>
          <input type="file" name="file" onChange={this.onFileInputChange} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path" type="text" value={this.props.value} />
        </div>
      </div>
    );
  }
}

export {
  ImageField as default,
};
