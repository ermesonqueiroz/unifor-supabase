require('dotenv').config();

const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const cors = require("cors");

const app = express();

const corsOptions = {
    origin: '*', 
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions))
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const supabase = supabaseClient.createClient(
    process.env.SUPABASE_API_URL, 
    process.env.SUPABASE_API_KEY
);


app.get('/products', async (req, res) => {
    const { data } = await supabase
        .from('products')
        .select();

    res.send(data);
    console.log(`lists all products${data}`);
});

app.get('/products/:id', async (req, res) => {
    console.log("id = " + req.params.id);
    const {data, error} = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id)
    res.send(data);

    console.log("retorno "+ data);
});

app.post('/products', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        })
    if (error) {
        res.send(error);
    }
    res.send("created!!");
    console.log("retorno "+ req.body.name);
    console.log("retorno "+ req.body.description);
    console.log("retorno "+ req.body.price);
});

app.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("updated!!");
});

app.delete('/products/:id', async (req, res) => {
    console.log("delete: " + req.params.id);
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id)
    if (error) {
        res.send(error);
    }
    res.send("deleted!!")
    console.log("delete: " + req.params.id);

});

app.get('/', (req, res) => {
    res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    res.send("Hello again I am working my friend to the moon and behind <3");
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`> Ready on http://localhost:${process.env.PORT || 3000}`);
});