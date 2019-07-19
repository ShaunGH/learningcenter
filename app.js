const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const static = require('koa-static');
const koaBody = require('koa-body')();
const path = require('path');
const Router = require('koa-router');
const db = require('./db');

var questionsForExam;
var currentQuestion;

app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.use(static(path.join(__dirname, './static')))

let router = new Router()

router.get('/', async (ctx) => {
  await ctx.render('index', {
    user: 123
  })
})

router.get('/exam', async (ctx) => {
  if (currentQuestion) {
    await ctx.render('exam', {
      question: currentQuestion,
      alert:'',
      error:''
    })
  } else {
    questionsForExam = await db.getQuestionsRandOrder();
    currentQuestion = questionsForExam.shift();
    await ctx.render('exam', {
      question: currentQuestion,
      alert:'',
      error:''
    })
  }
})

router.post('/exam', async (ctx) => {
  let request = ctx.request;
  if (questionsForExam.length == 0) {
    await ctx.redirect('/')
  } else {
    currentQuestion = questionsForExam.shift();
    await ctx.render('exam', {
      question: currentQuestion,
      alert:'',
      error:''
    })
  }
})

//Library Method
router.get('/library', async (ctx) => {
  let questions = await getQuestions();
  await ctx.render('library', {
    questions: questions,
    alert:'',
    error:''
  })
})

router.put('/library', async (ctx) => {
  ctx.request.body
})

router.post('/library/deleteQuestions', koaBody, async (ctx)=>{
  let qids = ctx.request.body;
  if(typeof(qids['qid'])=='string'){
    qids['qid'] = [qids['qid']];
  }
  let result = await db.deleteQuestions(qids['qid']);
  let questions = await getQuestions();
  await ctx.redirect('/library');
})

//Add Method
router.get('/add', async (ctx) => {
  await ctx.render('add', {
    alert: '',
    error: ''
  })
})

router.post('/add', koaBody, async (ctx) => {
  if (! await validateInput(ctx.request.body)) {
    return await ctx.render('add', {
      alert: '',
      error: 'ERROR - input is null!'
    })
  }
  let message = await db.createQuestion(ctx.request.body);
  if (message.startsWith('ERROR')) {
    return await ctx.render('add', {
      alert: '',
      error: message
    })
  } else {
    return await ctx.render('add', {
      alert: message,
      error: ''
    })
  }
})

var validateInput = async function(body) {
  if (body['title'] == '') return new Promise((resolve, reject)=>{resolve(false)})
  if (body['describe'] == '') return new Promise((resolve, reject)=>{resolve(false)});
  if (body['type'] == '') return new Promise((resolve, reject)=>{resolve(false)});
  if (body['language'] == '') return new Promise((resolve, reject)=>{resolve(false)});
  if (body['ranswer'] == '') return new Promise((resolve, reject)=>{resolve(false)});
  return new Promise((resolve, reject)=>{resolve(true)});
}

var getQuestions = async function(){
  let questions = await db.getQeustions();
  return new Promise((resolve, reject)=>{
    resolve(questions)
  });
}

app.use(router.routes())


app.listen(3000);