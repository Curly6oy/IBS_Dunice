const { array2map } = require('../common/mapUtil');

module.exports = (app) => {
    const { existsOrError, notExistsOrError } = app.api.validation;

    const save = (req, res) => {
        const employee = {
            id: req.body.id,
            name: req.body.name,
            identifier: req.body.identifier,
            email: req.body.email,
            phone: req.body.phone,
            userId: req.decoded.id,
        };

        if (req.params.id) employee.id = req.params.id;

        try {
            existsOrError(employee.name, 'Имя не указано!');
            existsOrError(employee.identifier, 'Идентификатор не указан!');
            existsOrError(employee.userId, 'Пользователь не указан!');
        } catch (msg) {
            return res.status(400).json({ errors: [msg] });
        }

        if (employee.id) {
            employee.updated_at = new Date();

            app.db('employees')
                .update(employee)
                .where({ id: employee.id })
                .then(() => res.status(204).send())
                .catch((err) => res.status(500).json({ errors: [err] }));
        } else {
            employee.created_at = new Date();
            employee.updated_at = null;

            app.db('employees')
                .insert(employee, 'id')
                .then(() => res.status(204).send())
                .catch((err) => res.status(500).json({ errors: [err] }));
        }
    };

    const remove = async (req, res) => {
        try {
            existsOrError(req.params.id, 'ID сотрудника не указано!');

            const rowsDeleted = await app.db('employees').where({ id: req.params.id }).del();
            existsOrError(rowsDeleted, 'Сотрудник не найден!');

            res.status(204).send();
        } catch (msg) {
            res.status(400).json({ errors: [msg] });
        }
    };

    const getRoomsIds = (userId) => {
        return new Promise((resolve, reject) => {
            app.db
                .select({ id: 'rooms.id' })
                .from('rooms')
                .leftJoin('teams', 'teams.roomId', 'rooms.id')
                .leftJoin('users', 'teams.userId', 'users.id')
                .where({ 'rooms.userId': userId })
                .orWhere({ 'users.id': userId })
                .then((rooms) => {
                    const roomsMap = array2map(rooms, 'id');
                    resolve({ userId, roomsIds: Object.keys(roomsMap).map((id) => parseInt(id, 10)) });
                })
                .catch((err) => reject(err));
        });
    };

    const getMembersIds = ({ userId, roomsIds }) => {
        return new Promise((resolve, reject) => {
            const membersIds = [userId];
            if (!roomsIds.length) {
                resolve(membersIds);
            } else {
                app.db
                    .select({
                        memberId: 'users.id',
                    })
                    .from('rooms')
                    .leftJoin('teams', 'teams.roomId', 'rooms.id')
                    .leftJoin('users', 'teams.userId', 'users.id')
                    .whereIn('rooms.id', roomsIds)
                    .then((rooms) => {
                        const team = rooms.map((r) => r.memberId);
                        resolve([...membersIds, ...team].filter((id) => id !== null));
                    })
                    .catch((err) => reject(err));
            }
        });
    };

    const getEmployees = (membersIds) => {
        return new Promise((resolve, reject) => {
            app.db('employees')
                .whereIn('employees.userId', membersIds)
                .then((employees) => resolve(employees))
                .catch((err) => reject(err));
        });
    };

    const get = (req, res) => {
        getRoomsIds(req.decoded.id)
            .then(getMembersIds)
            .then(getEmployees)
            .then((employees) => res.json(employees))
            .catch((err) => res.status(500).json({ errors: [err.message] }));
    };

    const getById = (req, res) => {
        app.db('employees')
            .where({ id: req.params.id })
            .first()
            .then((employee) => res.json(employee))
            .catch((err) => res.status(500).json({ errors: [err] }));
    };

    return { save, remove, get, getById };
};
