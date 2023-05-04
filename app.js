import  express from "express"
import  cors from "cors"
import dotenv from "dotenv"
import bodyParser from "body-parser";
import {translate} from "./traslate.js"

dotenv.config()

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }))

app.get('/',async (req, res) => {

  res.send('¡Hola mundo!');
});

app.post("/", async (req,res)=>{
  const {fromLanguage, toLanguage,fromText} = req.body
  console.log(req.body)
  try {
  const resp = await translate(fromLanguage, toLanguage, fromText)
  return res.json(resp)
  
} catch (error) {
  return res.statusCode(400).send({error:"Intentalo nuevamente"})

}

})



app.listen(process.env.PORT, () => {
  console.log('Servidor en ejecución en el puerto',process.env.PORT);
});
