module.exports = app => {
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) => {
        const equipment = {
            id: req.body.id,
            patrimony: req.body.patrimony,
            type: req.body.type,
            specification: req.body.specification,
            expirationDate: req.body.expirationDate,
            userId: req.decoded.id,
        }

        if (req.params.id) equipment.id = req.params.id

        try {
            existsOrError(equipment.patrimony, 'Patrimony was not informed!')
            existsOrError(equipment.type, 'Type was not informed!')
            existsOrError(equipment.userId, 'User was not informed!')
        } catch (msg) {
            return res.status(400).json({ errors: [msg] })
        }

        app.db.transaction(trx => {
            if (equipment.id) {
                delete equipment.userId
                equipment.updated_at = new Date()

                app.db('equipments')
                    .update(equipment)
                    .where({ id: equipment.id })
                    .transacting(trx)
                    .then(_ => trx.commit())
                    .catch(err => trx.rollback(err))
            } else {
                equipment.created_at = new Date()
                equipment.updated_at = null

                app.db('equipments')
                    .insert(equipment)
                    .returning('id')
                    .transacting(trx)
                    .then(_ => trx.commit())
                    .catch(err => trx.rollback(err))
            }
        })
        .then(() => res.status(204).send())
        .catch(err => res.status(500).json({ errors: [err] }))
    }


    const updateTeam = (equipmentId, team, res) => {
        app.db('teams').where({ equipmentId: equipmentId }).del().then(
            rowsDeleted => {
                insertTeam(equipmentId, team, res)
            }
        )
    }

    const insertTeam = (equipmentId, team, res) => {
        const rows = getTeamToInsert(equipmentId, team)

        const chunkSize = rows.lenght
        app.db.batchInsert('teams', rows, chunkSize)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getTeamToInsert = (equipmentId, team, initialTeam = []) => {
        return team.reduce((users, userId) => {
            users.push({ equipmentId, userId })
            return users
        }, initialTeam)
    }

    const remove = async (req, res) => {
        const trx = await app.db.transaction();  // Начало транзакции
    
        try {
            const equipmentId = req.params.id;
    
            // Проверка на существование ID оборудования
            existsOrError(equipmentId, "Equipment id was not informed!");
    
            // Проверка, есть ли связанные оценки
            const evaluations = await app.db('evaluations').where({ equipmentId }).transacting(trx);
            notExistsOrError(evaluations, "The equipment has evaluations!");
    
            // Логируем, что находимся в процессе удаления
            console.log(`Deleting equipment with ID: ${equipmentId}`);
    
            // Удаление из таблицы teams
            await app.db('teams').where({ equipmentId }).del().transacting(trx);
            console.log(`Deleted teams associated with equipment ID: ${equipmentId}`);
    
            // Удаление оборудования
            const rowsDeleted = await app.db('equipments').where({ id: equipmentId }).del().transacting(trx);
            existsOrError(rowsDeleted, "Equipment was not found!");
    
            await trx.commit();  // Завершаем транзакцию
            res.status(204).send();  // Ответ при успешном удалении
        } catch (msg) {
            await trx.rollback();  // Откат транзакции в случае ошибки
            console.error('Error during equipment removal:', msg);  // Логируем ошибку
            res.status(400).json({ errors: [msg] });  // Ответ с ошибкой
        }
    };
    
    const get = (req, res) => {
        const userId = req.decoded.id

        app.db.select(
            {
                id: 'equipments.id',
                patrimony: 'equipments.patrimony',
                type: 'equipments.type',
                specification: 'equipments.specification',
                expirationDate: 'equipments.expirationDate',
                userId: 'equipments.userId',
                date: 'equipments.created_at'
            }
        ).from('equipments')
            .leftJoin('users', 'equipments.userId', 'users.id')
            .where({ 'equipments.userId': userId }).orWhere({ 'users.id': userId })
            .then(equipments => {
                const equipmentsMap = equipments.reduce((map, equipment) => {
                    map[equipment.id] = equipment
                    return map
                }, {})

                const sortedEquipments = Object.values(equipmentsMap).sort((a, b) => {return new Date(b.date) - new Date(a.date)})

                res.json(sortedEquipments)
            })
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    const getById = (req, res) => {
        const userId = req.decoded.id

        app.db.select(
            {
                id: 'equipments.id',
                patrimony: 'equipments.patrimony',
                type: 'equipments.type',
                specification: 'equipments.specification',
                expirationDate: 'equipments.expirationDate',
                userId: 'equipments.userId',
                date: 'equipments.created_at'
            }
        ).from('equipments')
            .leftJoin('users', 'equipments.userId', 'users.id')
            .where({ 'equipments.id': req.params.id }).andWhere({ 'equipments.userId': userId })
            .then(equipments => res.json(equipments[0]))
            .catch(err => res.status(500).json({ errors: [err] }))
    }

    return { save, remove, get, getById }
}