const client = require('../lib/client');
// import our seed data:
const todoData = require('./todo-data.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

    try {
        await client.connect();

        const users = await Promise.all(
            usersData.map(user => {
                return client.query(`
                    INSERT INTO users (email, hash)
                    VALUES ($1, $2)
                    RETURNING *;
                    `,
                    [user.email, user.hash]);
            })
        );

        const user = users[0].rows[0];

        await Promise.all(
            todoData.map(todoItem => {
                return client.query(`
                    INSERT INTO todo (todo, completed, owner_id)
                    VALUES ($1, $2, $3);
                `,
                    [todoItem.todo, todoItem.completed, todoItem.user_id]);
            })
        );


        console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}
