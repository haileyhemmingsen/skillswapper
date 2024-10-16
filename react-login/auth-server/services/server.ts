import app from './app';
const PORT = process.env.PORT || 3080;

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
  console.log(`API Testing UI: http://localhost:${PORT}/api/v0/docs/`);
});