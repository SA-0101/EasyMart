const CLIENT_URL = process.env.CLIENT_URL;

const corsFunc = (req, res) => {
  return {
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  };
};
module.exports = corsFunc;
