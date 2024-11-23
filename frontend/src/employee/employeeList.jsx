import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getList, showUpdate, showDelete } from './employeeActions';

class EmployeeList extends Component {
    componentDidMount() {
        this.props.getList();
    }

    getFormatedDate(isoDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(isoDate);
        return `${date.toLocaleDateString('ru-RU', options)} в ${date.toLocaleTimeString('ru-RU')}`;
    }

    renderRows() {
        const { list } = this.props;

        if (!Array.isArray(list) || list.length === 0) {
            console.log('Список сотрудников пуст');
            return (
                <tr>
                    <td colSpan="4">Сотрудников нет</td>
                </tr>
            );
        }

        return list.map(employee => (
            <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.identifier}</td>
                <td>{employee.created_at ? this.getFormatedDate(employee.created_at) : '-'}</td>
                <td>
                    <button
                        className='btn btn-default'
                        onClick={() => this.props.showUpdate(employee)}
                    >
                        <i className='icon ion-md-create'></i>
                    </button>
                    <button
                        className='btn btn-danger'
                        onClick={() => this.props.showDelete(employee)}
                    >
                        <i className='icon ion-md-trash'></i>
                    </button>
                </td>
            </tr>
        ));
    }

    render() {
        console.log('Список сотрудников перед рендерингом:', this.props.list);

        return (
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Идентификатор</th>
                            <th>Дата создания</th>
                            <th className='table-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderRows()}</tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log('Данные сотрудников из Redux:', state.employee.list);
    return {
        list: state.employee.list || []
    };
};


const mapDispatchToProps = dispatch =>
    bindActionCreators({ getList, showUpdate, showDelete }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeList);
