const express = require('express');
const bodyParser = require('body-parser');

const api = require('./api');
const middleware = require('./middleware');

const PORT = process.env.PORT || 1337;

const app = express();

app.use(bodyParser.json());

app.get('/health', api.getHealth);
app.get('/:student_id', api.getStudent);
app.put('/:student_id', api.addStudent);
app.delete('/:student_id', api.deleteStudent);
app.get('/:student_id/*', api.getStudentProperty);
app.put('/:student_id/*', api.addStudentProperty);
app.delete('/:student_id/*', api.deleteStudentProperty);

app.use(middleware.handleError);
app.use(middleware.notFound);

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

if (require.main !== module) {
  module.exports = server;
}
