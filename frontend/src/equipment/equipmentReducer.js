const INITIAL_STATE = { list: [] }

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'EQUIPMENTS_FETCHED':
            return { ...state, list: action.payload.data }
        case 'EQUIPMENTS_DELETED':
            return {
                ...state,
                list: state.list.filter(equipment => equipment.id !== action.payload) // Удаляем оборудование из списка
            }
        default:
            return state
    }
}