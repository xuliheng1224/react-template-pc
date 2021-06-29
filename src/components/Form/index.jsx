import React, { Component } from 'react';
import { Button, Form, Row, Col, Icon } from 'antd';

class CustomForm extends Component {
  state = {
    showAllConditions: false
  };

  setFieldsValue = (kv) => {
    this.props.form.setFieldsValue(kv);
  }

  validateFields = (func) =>{
    this.props.form.validateFields(func);
  }

  formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  handleOnShowMoreCondition = () => {
    this.setState({ showAllConditions: !this.state.showAllConditions})
  }

  handleSubmit = (e) => { 
    if(e) {
      e.preventDefault();
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if(this.props.handleSubmit){
          this.props.handleSubmit(values);         
        }
      }
    });
  };
  
  handleSearch = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.handleSearch) {
          this.props.handleSearch(values);
        }
      }
    });
  }
  handleReset = () => {
    this.props.form.resetFields();
    this.props.handleReset();
  }

  /**
   * @private
   */
  createFieldDecorator = (config) => {
    const { getFieldDecorator } = this.props.form;
    let width = '100%';

    if(config.props && config.props.style && config.props.style.width) {
      width = config.props.style.width;
    } 

    if(config.fieldName) {
      return getFieldDecorator(config.fieldName, {
        rules: config.rules,
        initialValue: config.initialValue,
      })(
        config.instance 
          ? config.instance
          : <config.component {...config.props} form={this.props.form} style={{width: width}} disabled={config.disableStatus} >{config.childrens ? config.childrens : null}</config.component>
      )
    } else {
      return config.instance ? config.instance : <config.component {...config.props} form={this.props.form} style={{width: width}} disabled={config.disableStatus} >{config.childrens ? config.childrens : null}</config.component>
    }
    
  }

  /**
   * @private
   * 创建多列的表单
   */
  createFormItem = (config, i) => {
    const spanSize = Math.floor( 24 / (this.props.colNum || 1) );
    const formItemLayout = config.formItemLayout || this.props.formItemLayout || this.formItemLayout;
    if(config.hidden) return null;
    
    return (
      <Col span={config.span || spanSize} key={config.fieldName || i}>
        <Form.Item {...formItemLayout} label={config.label}>
          { this.createFieldDecorator(config)}
          
          {
            config.belowTips ? <div style={{lineHeight: '150%', padding: '5px 0px', color: '#999'}}>{config.belowTips}</div> : null
          }
        </Form.Item>
      </Col>
    )
  }

  /**
   * @private
   * 创建单行的表单
   */
  createInlineFormItem = (config) => {
    const formItemLayout = this.props.formItemLayout || this.formItemLayout;

    return (
      <Form.Item {...formItemLayout} label={config.label} key={config.fieldName}>
        { this.createFieldDecorator(config) }
      </Form.Item>
    )
  }

  render(){
    let align = this.props.btnAlign? this.props.btnAlign : 'right';
    let btnDisplay = 'inline-block';
    let resetDisplay = 'inline-block';

    if (this.props.btnStatus === 'none') btnDisplay = 'none';
    if (this.props.resetStatus === 'none') {
      resetDisplay = 'none';
    } else if(this.props.btnStatus) {
      align = this.props.btnStatus;
    }
    if(this.props.allDisabled){
      this.props.formConfig.map(item => {
        const el = item; 
        el.disableStatus = true;

        return el;
      })
    }
    if(this.props.layout !== 'inline') {
      // not inline
      return (
        <Form onSubmit={this.handleSubmit} style={{ minWidth: this.props.minWidth || null}}>
          <Row gutter={24}>
            {
              this.props.formConfig.map((config, i) => {
                if(this.props.showCollapse && !this.state.showAllConditions && i >= this.props.colNum) {
                  return null
                }

                return this.createFormItem(config, i)
              })
            }
          </Row>
          {
            this.props.bottomSpacing ? <br /> : null
          }
          <Row gutter={24}>
            <Col span={24} style={{ textAlign: align, width: this.props.btnContentWidth || "100%"}}>
              <Button type="primary" onClick={this.handleSearch} style={{ marginRight: 10, display: this.props.search? 'inline-block' : 'none' }}>查询</Button>
              <Button onClick={this.handleReset} style={{ marginRight: 10, display: this.props.reset? 'inline-block' : 'none' }}>重置</Button>

              <Button onClick={this.props.handleCancel} style={{ marginRight: 10, display: this.props.cancel? 'inline-block' : 'none' }}>{this.props.cancelText || '取消'}</Button>
              <Button type="primary" htmlType="submit" style={{ display: this.props.submit? 'inline-block' : 'none' }} className="login-form-button">{this.props.submitText || '提交'}</Button>
              <Button type="link" style={{ display: this.props.showCollapse ? 'inline-block' : 'none' }} onClick={this.handleOnShowMoreCondition}>
                {
                  this.state.showAllConditions ? '收起' : '更多条件'
                }
                <Icon type={this.state.showAllConditions ? 'up' : 'down'} />
              </Button>
            </Col>
          </Row>
        </Form>
      )
    } else {
      // inline
      return (
        <Form onSubmit={this.handleSubmit} layout='inline'>
          {
            this.props.formConfig.map((config) => this.createInlineFormItem(config))
          }    
          <Button  type="primary" htmlType="submit" className="login-form-button" style={{ display: btnDisplay, marginRight: 10}}>
            {this.props.searchButton ? this.props.searchButton : '查询' } 
          </Button>
          <Button className="login-form-button" style={{ display: resetDisplay }} onClick={this.handleReset}>
            {this.props.resetButton ? this.props.resetButton : '重置'}
          </Button>
        </Form>
      )
    }
  }
}

export default Form.create()(CustomForm)