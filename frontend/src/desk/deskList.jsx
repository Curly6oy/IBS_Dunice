import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getList, showUpdate, showDelete } from './deskActions'

class EvaluatonList extends Component {

    componentWillMount() {
        this.props.getList()
    }

    getFormatedDate(isoDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        
        const date = new Date(isoDate)
        return `${date.toLocaleDateString('en-US', options)} at ${date.toLocaleTimeString('en-US')}`
    }

    renderRows() {
        const list = this.props.list || []
        return list.map(desk => (
            <tr key={desk.id}>
                <td>{desk.id}</td>                
                <td>{desk.chairDirection}</td>                
                <td>{desk.x}</td>                
                <td>{desk.y}</td>                
                <td>{desk.roomName}</td>                
                <td>{this.getFormatedDate(desk.date)}</td>
                <td>
                    <button className='btn btn-default' onClick={() => this.props.showUpdate(desk)}>
                        <i className='icon ion-md-create'></i>
                    </button>
                    <button className='btn btn-danger' onClick={() => this.props.showDelete(desk)}>
                        <i className='icon ion-md-trash'></i>
                    </button>
                </td>
            </tr>
        ))
    }

    render() {
        return (
            <div>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Идентификатор</th>
                            <th>Направление стола</th>
                            <th>X позиция</th>
                            <th>Y позиция</th>
                            <th>Комнота</th>
                            <th>Создан</th>
                            <th className='table-actions'>Дейстия</th>
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

const mapStateToProps = state => ({list: state.desk.list})
const mapDispatchToProps = dispatch => bindActionCreators({getList, showUpdate, showDelete}, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(EvaluatonList)