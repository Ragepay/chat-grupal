import express from 'express'
import handlebars from 'express-handlebars'
import { __dirname } from './utils.js'


const app = express();
const PORT = 8080 || 3000;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.render("chatbox", {
        name: "Benjamin"
    })
});



app.listen(PORT, () => {
    console.log("Server ON")
});