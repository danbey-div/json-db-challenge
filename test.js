const tape = require('tape');
const jsonist = require('jsonist');

const port = (process.env.PORT =
  process.env.PORT || require('get-port-sync')());
const endpoint = `http://localhost:${port}`;

const server = require('./server');

tape('health', async function(t) {
  const url = `${endpoint}/health`;
  jsonist.get(url, (err, body) => {
    if (err) t.error(err);
    t.ok(body.success, 'should have successful healthcheck');
    t.end();
  });
});

tape('add-student-id', async function(t) {
  const url = `${endpoint}/rn1abu8`;
  jsonist.put(url, {}, {}, (err, body) => {
    t.plan(1);
    if (err) t.error(err);
    t.ok(body.success, 'Add Student CHECK');
    t.end();
  });
});

tape('add-student-property', async function(t) {
  const url = `${endpoint}/rn1abu8/courses/calculus/quizzes/ye0ab61`;
  jsonist.put(url, { score: '98' }, {}, (err, body) => {
    if (err) t.error(err);
    t.ok(body.success, 'Add Student Property CHECK');
    t.end();
  });
});

tape('get-student-id', async function(t) {
  const url = `${endpoint}/rn1abu8`;
  jsonist.get(url, {}, (err, body) => {
    t.plan(1);
    if (err) t.error(err);
    t.deepEqual(
      body,
      {
        courses: {
          calculus: {
            quizzes: {
              ye0ab61: {
                score: '98'
              }
            }
          }
        }
      },
      'Get Student CHECK'
    );
    t.end();
  });
});

tape('get-student-property', async function(t) {
  const url = `${endpoint}/rn1abu8/courses/calculus`;
  jsonist.get(url, {}, (err, body) => {
    t.plan(1);
    if (err) t.error(err);
    t.deepEqual(
      body,
      {
        quizzes: {
          ye0ab61: {
            score: '98'
          }
        }
      },
      'Get Student Property CHECK'
    );
    t.end();
  });

  tape('delete-student-property', async function(t) {
    const url = `${endpoint}/rn1abu8/courses/calculus/`;
    jsonist.delete(url, {}, (err, body) => {
      t.plan(1);
      if (err) t.error(err);
      t.ok(body.success, 'Delete Student Property CHECK');
      t.end();
    });
  });

  tape('delete-student-id', async function(t) {
    const url = `${endpoint}/rn1abu8`;
    jsonist.delete(url, {}, (err, body) => {
      t.plan(1);
      if (err) t.error(err);
      t.ok(body.success, 'Delete Student CHECK');
      t.end();
    });
  });

  tape('cleanup', function(t) {
    setTimeout(function() {
      server.close();
      t.end();
    }, 500);
  });
});
