import React from 'react'
import MenuItem from './menuItem'
import MenuTree from './menuTree'

export default props => (
    <ul className='sidebar-menu' data-widget="tree">
        <MenuItem path='/' label='Dashboard' icon='stats' />
        <MenuTree label='Management' icon='rocket'> 
            <MenuItem path='rooms' label='Комнаты' icon='cube' />    
            <MenuItem path='employees' label='Работники' icon='people' />
            <MenuItem path='equipments' label='Оборудование' icon='laptop' />      
            <MenuItem path='desks' label='Рабочие место' icon='desktop' />  
        </MenuTree>
        <MenuItem path='timeline' label='Timeline' icon='calendar' />      
    </ul>
)