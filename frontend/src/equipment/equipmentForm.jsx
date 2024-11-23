import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { reduxForm, Field } from 'redux-form'
import LabelAndInput from '../common/form/labelAndInput'
import { init } from './equipmentActions'
import Date from '../common/form/date'
import Select from '../common/form/select'

const getPossibleEquipments = () => {
    const equipments = []
    equipments.push({ id: 'Chair', type: 'Стул' })
    equipments.push({ id: 'Desk', type: 'Стол' })
    equipments.push({ id: 'Desktop', type: 'Настольный компьютер' })
    equipments.push({ id: 'Drawer', type: 'Выдвижной ящик' })
    equipments.push({ id: 'Laptop', type: 'Ноутбук' })
    equipments.push({ id: 'Monitor', type: 'Монитор' })
    equipments.push({ id: 'Phone', type: 'Телефон' })
    return equipments
}

class EquipmentForm extends Component {
    render() {
        const { handleSubmit, readOnly } = this.props
        return (
            <form role='form' onSubmit={handleSubmit}>
                <div className='box-body'>

                    <Field cols='12 2'
                        name="patrimony"
                        type="text"
                        component={LabelAndInput}
                        label="Имущество"
                        readOnly={readOnly}
                    />

                    <Field name="type" cols='12 2'
                        component={Select}
                        label="Вид"
                        options={getPossibleEquipments()}
                        optionValue='id' optionLabel='type'
                        readOnly={readOnly} />

                    <Field cols='12 6'
                        name="specification"
                        type="text"
                        component={LabelAndInput}
                        label="Спецификация"
                        readOnly={readOnly}
                    />


                    <Field cols='12 2'
                        id="expirationDate"
                        name="expirationDate"
                        label="Срок хранения"
                        component={Date}
                        readOnly={readOnly}
                    />

                </div>
                <div className='box-footer text-right'>
                    <button type='submit' className={`btn btn-${this.props.submitClass}`}>
                        {this.props.submitLabel}
                    </button>
                    <button type='button' className='btn btn-default'
                        onClick={this.props.init}>Отмена</button>
                </div>
            </form>
        )
    }
}

EquipmentForm = reduxForm({ form: 'equipmentForm', destroyOnUnmount: false })(EquipmentForm)

const mapStateToProps = state => ({ })
const mapDispatchToProps = dispatch => bindActionCreators({ init}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentForm)
