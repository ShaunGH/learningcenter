const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Model = Sequelize.Model;
const sequelize = new Sequelize('learnCenter', 'root', '1qaz!QAZ', {
    host: 'localhost', // 数据库地址
    dialect: 'mysql', // 指定连接的数据库类型
    pool: {
        max: 5, // 连接池中最大连接数量
        min: 0, // 连接池中最小连接数量
        idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
    }
});


class questionsModel extends Model {}
questionsModel.init({
    title: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    describe: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    language: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ranswer: {
        type: Sequelize.STRING,
        allowNull: true
    },
    wanswer: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'questions'
});

module.exports.createQuestion = async function (question) {
    return await questionsModel.create({
        title: question['title'],
        describe: question['describe'],
        type: question['type'],
        language: question['language'],
        ranswer: question['ranswer'],
        wanswer: question['wanswer'],
        createdAt: Date.now(),
        updatedAt: Date.now()
    }).then(r => {
        return 'INFO - Insert success! id is ' + r.id
    }).catch(error => {
        console.log("ERROR - " + error);
        return 'ERROR - ' + error;
    });
}

module.exports.getQeustions = async function () {
    return await questionsModel.findAll().then(q => {
        q.forEach(element => {
            element['moreinfo'] = 'Type: ' + element['type'] + '\nLanguage: ' + element['language'] 
          + '\nTitle: ' + element['title'] + '\nRanswer: ' + element['ranswer'] + '\nWanswer: ' + element['wanswer']
          });
        return q;
    }).catch(error => {
        console.log("ERROR - " + error);
        return 'ERROR - ' + error;
    })
}

module.exports.getQeustionById = async function (id) {
    return await questionsModel.findAll({
        where: {
            id: id
        }
    }).then(r => {
        return r
    }).catch(error => {
        console.log("ERROR - " + error);
        return 'ERROR - ' + error;
    })
}

module.exports.getQuestionsRandOrder = async function () {
    return await questionsModel.findAll({
        order: sequelize.random(),
        limit: 30
    }).then(r => {
        return r
    }).catch(error => {
        console.log("ERROR - " + error);
        return 'ERROR - ' + error;
    })
}

module.exports.deleteQuestions = async function (ids) {
    return await questionsModel.destroy({
        where: {
            id: {
                [Op.in]: ids
            }
        }
    }).then(r => {
        return 'INFO - delete success!' + r;
    }).catch(error => {
        console.log("ERROR - " + error);
        return 'ERROR - ' + error;
    })
}

// db.sequelize.query('select * from user where age >= 18 ', {
//     type: db.sequelize.QueryTypes.SELECT
//   })