import app from "./app.js";

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Your server is running on PORT: ${port}`);
});
