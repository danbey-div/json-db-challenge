module.exports = {
  getHealth,
  getStudent,
  addStudent,
  deleteStudent,
  getStudentProperty,
  addStudentProperty,
  deleteStudentProperty
};

const dataPath = './data/';
const fs = require('fs');

// refactored helper methods
const readFile = (
  callback,
  returnJson = false,
  filePath = dataPath,
  writeAble = true,
  encoding = 'utf8'
) => {
  if (fs.existsSync(filePath)) {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        throw err;
      }
      callback(returnJson ? JSON.parse(data) : data);
    });
  } else if (writeAble) {
    fs.writeFile(filePath, '{}', encoding, err => {
      if (err) {
        throw err;
      }
    });
    callback(returnJson ? JSON.parse('{}') : data);
  } else {
    callback(null);
  }
};

const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  encoding = 'utf8'
) => {
  fs.writeFile(filePath, fileData, encoding, err => {
    if (err) {
      throw err;
    }

    callback();
  });
};

const deleteFile = (callback, filePath = dataPath, encoding = 'utf8') => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, err => {
      if (err) {
        throw err;
      }
      callback({ success: true });
    });
  } else {
    callback(null);
  }
};

async function addStudent(req, res, next) {
  readFile(
    data => {
      return res.status(200).send({ success: true });
    },
    true,
    dataPath + req.params['student_id'] + '.json'
  );
}

async function getStudent(req, res, next) {
  readFile(
    data => {
      if (data) {
        return res.status(200).send(data);
      } else {
        return res.status(404).send({
          error: 'Not Found'
        });
      }
    },
    true,
    dataPath + req.params['student_id'] + '.json',
    false
  );
}

async function deleteStudent(req, res, next) {
  deleteFile(data => {
    if (data) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(404).send({
        error: 'Not Found'
      });
    }
  }, dataPath + req.params['student_id'] + '.json');
}

async function addStudentProperty(req, res, next) {
  const pathUrl = dataPath + req.params['student_id'] + '.json';
  readFile(
    data => {
      const properties = req.params['0'].split('/');
      let temp = data;
      for (let i = 0; i < properties.length; i++) {
        if (properties[i] === '') break;
        if (temp[properties[i]] === undefined) {
          temp[properties[i]] = {};
        }
        temp = temp[properties[i]];
      }
      for (var item in req.query) {
        temp[item] = req.query[item];
      }
      for (var item in req.body) {
        temp[item] = req.body[item];
      }
      writeFile(
        JSON.stringify(data, null, 2),
        () => {
          res.status(200).send({ success: true });
        },
        pathUrl
      );
    },
    true,
    pathUrl
  );
}

async function getStudentProperty(req, res, next) {
  const pathUrl = dataPath + req.params['student_id'] + '.json';
  if (fs.existsSync(pathUrl)) {
    readFile(
      data => {
        const properties = req.params['0'].split('/');
        for (let i = 0; i < properties.length; i++) {
          if (properties[i] === '') break;
          if (data[properties[i]] === undefined) {
            return res.status(404).send({
              error: 'Not Found'
            });
          }
          data = data[properties[i]];
        }
        if (data != undefined) {
          return res.status(200).send(data);
        } else {
          return res.status(404).send({
            error: 'Not Found'
          });
        }
      },
      true,
      pathUrl,
      false
    );
  } else {
    return res.status(404).send({
      error: 'Not Found'
    });
  }
}

async function deleteStudentProperty(req, res, next) {
  const pathUrl = dataPath + req.params['student_id'] + '.json';
  readFile(
    data => {
      const properties = req.params['0'].split('/');
      const length = properties.length;
      let i,
        temp = data;
      for (i = 0; i < length - 1; i++) {
        if (properties[i + 1] === '') break;
        if (temp[properties[i]] === undefined) {
          return res.status(404).send({
            error: 'Not Found'
          });
        }
        temp = temp[properties[i]];
      }
      if (temp[properties[i]] != undefined) {
        temp[properties[i]] = {};
        writeFile(
          JSON.stringify(data, null, 2),
          () => {
            res.status(200).send({ success: true });
          },
          pathUrl
        );
      } else {
        return res.status(404).send({
          error: 'Not Found'
        });
      }
    },
    true,
    pathUrl,
    false
  );
}

async function getHealth(req, res, next) {
  res.json({ success: true });
}
