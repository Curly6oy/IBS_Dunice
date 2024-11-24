import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, showDelete } from './employeeActions'

class EmployeeList extends Component {
    state = {
        search: ''
    }

    componentWillMount() {
        this.props.getList()
    }

    getFormatedDate(isoDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        
        const date = new Date(isoDate)
        return `${date.toLocaleDateString('en-US', options)} at ${date.toLocaleTimeString('en-US')}`
    }

    handleSearchChange = (event) => {
        this.setState({ search: event.target.value })
    }

    renderRows() {
        const { search } = this.state
        const list = this.props.list.filter(employee => 
            employee.name.toLowerCase().includes(search.toLowerCase())
        )
        
        return list.map(employee => (
            <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.identifier}</td>
                <td>{employee.created_at ? this.getFormatedDate(employee.created_at) : '-'}</td>
                <td>
                    <button className='btn btn-default' onClick={() => this.props.showUpdate(employee)}>
                        <i className='icon ion-md-create'></i>
                    </button>
                    <button className='btn btn-danger' onClick={() => this.props.showDelete(employee)}>
                        <i className='icon ion-md-trash'></i>
                    </button>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <div>
                <div className="search-container">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name"
                        value={this.state.search}
                        onChange={this.handleSearchChange}
                    />
                </div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Identifier</th>
                            <th>Created at</th>
                            <th className='table-actions'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    list: state.employee.list
})
const mapDispatchToProps = dispatch => bindActionCreators({ getList, showUpdate, showDelete }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeList)
