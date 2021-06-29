import React, { Component } from 'react';
import { Modal } from 'antd';

export default class CustomDialog extends Component {
  state = {
    visible: false,
    data: {},
    formData: {},
    loading: false
  }

  modelConfig = {
    title: '对话框',
    okText: '确定',
    cancelText: '取消',
    width: 520,
  }

  dialogRef = React.createRef();

  show = (data) => {
    this.setState(prevState => {
      return {
        ...prevState,
        data,
        visible: true,
      }
    }, () => {
      if (typeof this.onOpen === 'function') {
        this.onOpen();
      }
    })

  };

  onOk = () => {
    if (typeof this.onSubmit === 'function') {
      this.onSubmit()
    }
  }

  close = () => {
    this.setState({ visible: false, data: {}, formData: {}, loading: false });
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };

  render (dialogContent) {
    return (
      <Modal
        ref={this.dialogRef}
        visible={this.state.visible}
        mask
        maskClosable={false}
        destroyOnClose
        keyboard
        onOk={this.onOk}
        onCancel={this.close}
        {...this.modelConfig}
      >
        {dialogContent}
      </Modal>
    )
  }
}