const express = require('express');
const router = express.Router();
const Lesson = require("../model/Lessons"); 
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// const { registerStudent, getAllStudents } = require('../controller/student.controller.js');
const studentController = require('../controller/student.controller');

// const { askAI } = require('../controller/student.controller');
// POST /api/students
router.post('/', studentController.registerStudent);

// GET /api/students
router.get('/', studentController.getAllStudents);

router.post('/login', studentController.studentLogin);

// studentRoutes.js or wherever you define routes
router.get('/:id', studentController.getStudentById);

// router.post('/ask-ai', async (req, res) => {
//   try {
//     const { question, subject } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: 'Question is required' });
//     }

//     // ✅ Step 1: Fetch relevant lessons (filtered by subject or all)
//     let filter = {};
//     if (subject && subject !== 'All') {
//       filter.subject = subject;
//     }

//     const lessons = await Lesson.find(filter).sort({ createdAt: -1 });

//     if (!lessons.length) {
//       return res.status(404).json({ error: 'No lessons found for this subject' });
//     }

//     // ✅ Step 2: Prepare notes content
//     const combinedNotes = lessons.map((l, i) => `Title: ${l.title}\nNote: ${l.note}`).join('\n\n');

//     // ✅ Step 3: Ask ChatGPT using the notes
//     const completion = await openai.chat.completions.create({
//       model: 'gpt-4', // or gpt-3.5-turbo
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an intelligent tutor assistant. Answer based only on the notes provided.',
//         },
//         {
//           role: 'user',
//           content: `Here are the tutor's notes:\n\n${combinedNotes}\n\nQuestion: ${question}`,
//         },
//       ],
//     });

//     const answer = completion.choices[0]?.message?.content || 'No answer generated';

//     res.status(200).json({ answer });
//   } catch (err) {
//     console.error('AI error:', err.message);
//     res.status(500).json({ error: 'Something went wrong', message: err.message });
//   }
// });
router.post('/ask-ai', async (req, res) => {
  try {
    const { question, subject } = req.body;
    console.log('Received question:', question);
    console.log('Subject filter:', subject);

    const lessons = await Lesson.find(subject && subject !== 'All' ? { subject } : {});
    console.log('Lessons found:', lessons.length);

    const combinedNotes = lessons.map(l => `Title: ${l.title}\nNote: ${l.note}`).join('\n\n');

   const chatResponse = await openai.chat.completions.create({
  model: 'mistralai/mistral-7b-instruct', // ✅ or another valid model
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant. Answer questions using only the provided notes.',
    },
    {
      role: 'user',
      content: `Notes:\n${combinedNotes}\n\nQuestion: ${question}`,
    },
  ],
});


    const answer = chatResponse.choices[0]?.message?.content;
    return res.status(200).json({ answer });
  } catch (err) {
    console.error('❌ Error with OpenRouter:', err);
    return res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// OpenRouter via OpenAI SDK
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   baseURL: 'https://openrouter.ai/api/v1',
// });

// router.post('/ask-ai', async (req, res) => {
//   try {
//     const { question, subject } = req.body;

//     if (!question) {
//       return res.status(400).json({ error: 'Question is required' });
//     }

//     // Optional subject filter
//     let filter = {};
//     if (subject && subject !== 'All') {
//       filter.subject = subject;
//     }

//     const lessons = await Lesson.find(filter).sort({ createdAt: -1 });

//     if (!lessons.length) {
//       return res.status(404).json({ error: 'No lessons found for this subject' });
//     }

//     const combinedNotes = lessons.map((l) => `Title: ${l.title}\nNote: ${l.note}`).join('\n\n');

//     // Use OpenRouter (OpenAI SDK compatible)
//     const chatResponse = await openai.chat.completions.create({
//       model: 'openchat/openchat-7b', // You can change to another OpenRouter model
//       messages: [
//         {
//           role: 'system',
//           content: 'You are a helpful assistant. Answer questions using only the provided notes.',
//         },
//         {
//           role: 'user',
//           content: `Notes:\n${combinedNotes}\n\nQuestion: ${question}`,
//         },
//       ],
//     });

//     const answer = chatResponse.choices[0]?.message?.content;
//     res.status(200).json({ answer });
//   } catch (err) {
//     console.error('Error with OpenRouter:', err.message);
//     res.status(500).json({ error: 'Failed to get response from AI', details: err.message });
//   }
// });


module.exports = router;
