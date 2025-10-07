const { run, runMigrations } = require('./db');

async function seed() {
  runMigrations();
  const subjects = [
    { title: 'Mathematics', band: '6-8' },
    { title: 'Science', band: '6-8' },
    { title: 'English', band: '6-8' },
    { title: 'Mathematics', band: '9-12' },
    { title: 'Physics', band: '9-12' },
    { title: 'Chemistry', band: '9-12' },
  ];

  for (const s of subjects) {
    await run('INSERT INTO subjects (title, grade_band) VALUES (?, ?)', [s.title, s.band]);
  }

  // A couple lessons
  await run('INSERT INTO lessons (subject_id, title, description, content) VALUES (1, ?, ?, ?)', [
    'Fractions Basics',
    'Understanding fractions and their operations',
    'Content for fractions basics...'
  ]);
  await run('INSERT INTO lessons (subject_id, title, description, content) VALUES (1, ?, ?, ?)', [
    'Introduction to Algebra',
    'Variables and simple equations',
    'Content for intro to algebra...'
  ]);

  console.log('Seed complete');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
