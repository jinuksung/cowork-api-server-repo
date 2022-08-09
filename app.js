const { application } = require('express');
const express = require('express');
const app = express();
const db = require('./models');
const { Member } = db;

app.use(express.json());
// 서버로 온 리퀘스트의 바디에 json이 있을 경우, 그것을 추출하여 리퀘스트 바디의 바디 프로퍼티로 설정해줌(미들웨어)
// 미들웨어: 서버로 온 리퀘스트에 대해 처리해주는 함수

app.get('/api/members', async (req, res) => {
  const { team } = req.query;
  if (team) {
    const teamMembers = await Member.findAll({ where: { team } });
    res.send(teamMembers);
  } else {
    const members = await Member.findAll();
    res.send(members);
  }
});

app.get('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const member = await Member.findOne({ where: { id } });
  if (member) {
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no member with this ID' });
  }
});

app.post('/api/members', async (req, res) => {
  const requestBody = req.body;
  const newMember = await Member.build(requestBody);
  console.log(`Before: ${newMember.id}`);
  await newMember.save();
  console.log(`After: ${newMember.id}`);
  res.send(newMember);
});

// app.put('/api/members/:id', async (req, res) => {
//   const { id } = req.params;
//   const newInfo = req.body;
//   const result = await Member.update(newInfo, { where: { id } });
//   console.log(result);
//   if (result[0]) {
//     res.send({ message: `${result[0]} row(s) affected` });
//   } else {
//     res.status(404).send({ message: 'There is no such member with the ID' });
//   }
// });

app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const member = await Member.findOne({ where: { id } });
  if (member) {
    Object.keys(newInfo).forEach((prop) => {
      member[prop] = newInfo[prop];
    });
    await member.save();
    res.send(member);
  } else {
    res.status(404).send({ message: 'There is no such member with the ID' });
  }
});

app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const deleteCount = await Member.destroy({ where: { id } });
  if (deleteCount) {
    res.send({ message: `${deleteCount} row(s) deleted` });
  } else {
    res.status(404).send({ message: 'there is no such member with the ID' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('server is listening...');
});
