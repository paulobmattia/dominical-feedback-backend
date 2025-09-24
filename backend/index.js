import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let feedbacks = [];

app.post('/feedback', (req, res) => {
  const { ratings, comment } = req.body;
  feedbacks.push({ ratings, comment });
  res.json({ message: 'Feedback recebido com sucesso!' });
});

app.get('/results', (req, res) => {
  if (feedbacks.length === 0) {
    return res.json({ averages: {}, comments: [], analysis: 'Nenhum feedback ainda.' });
  }

  const topics = Object.keys(feedbacks[0].ratings);
  const averages = {};
  topics.forEach(topic => {
    const sum = feedbacks.reduce((acc, fb) => acc + fb.ratings[topic], 0);
    averages[topic] = (sum / feedbacks.length).toFixed(2);
  });

  const comments = feedbacks.filter(fb => fb.comment).map(fb => fb.comment);

  const analysis = `Os alunos estão avaliando os tópicos com médias variadas. 
  O que está indo bem deve ser mantido, e os pontos com média mais baixa devem ser trabalhados.`;

  res.json({ averages, comments, analysis });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
