import React, { PureComponent } from 'react'
import SearchForm from '../SearchForm'
import CustomTable from '../CustomTable'

export default class CustomPage extends PureComponent {
  tableRef = React.createRef()
  formRef = React.createRef()
  state = {
    formData: {},
    loading: false
  }

  // authority (code) {
  //   const permissions = this.props.permissions || []

  //   return permissions.indexOf(code) !== -1 ? true : false
  // }

  handleSearch = (value) => {
    this.setState({
      formData: value,
      loading: true
    }, () => {
      this.tableRef.current.state.pagination.current = 1
      this.tableRef.current.handleGetPaginationInfo()
      setTimeout(() => {
        this.setState({ loading: false })
      }, 1500);
    })
  }

  render () {
    // const padding = this.pagePadding || '15px 15px 75px 15px'
    const { location } = this.props;
    const { loading, formData } = this.state;

    return (
      <>
        <SearchForm wrappedComponentRef={this.formRef} formData={formData} {...this.props.getFormConfig} handleSearch={this.handleSearch} location={location} loading={loading} />

        <div style={{ paddingTop: '10px' }}></div>

        <CustomTable wrappedComponentRef={this.tableRef} {...this.props.getTableConfig} location={location} />
      </>
    )
  }
}
