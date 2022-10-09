const mongoose = require('mongoose');
const express = require('express');

const app = express();
const port = 3000;

app.use(express.json()); // si no no levanta los bodies

class RestError extends Error{
    constructor(message, status){
        super(message)
        this.status = status;
    }
}

app.get('/events', async (req, res) => {
    const events = await Event.find().lean(); // lean lo vuelve json
    res.send(events);
});

app.get('/events/:id', async (req, res) => {
    const id = req.params.id;
    const evento = await Event.findById(id).lean();
    if(!evento){
        throw new RestError('Recurso no encontado', 404);
    }
    res.send(evento);
});

app.post('/events', async (req, res) => {
    console.log(req);
    const name = req.body.name;
    const description = req.body.description;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const country = req.body.country;
    const city = req.body.city;

    const event = new Event({
        name: name,
        description: description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        country: country,
        city: city,
        enabled: false
    });

    const newEvent = await event.save();
    console.log(newEvent);

    res.status(201);
    res.send(newEvent);
})

const eventSchema = new mongoose.Schema({
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    country: String,
    city: String,
    enabled: Boolean
});


const Event = mongoose.model('Event', eventSchema);

const conciertoBuitres = new Event({
    name: 'Concierto Buitres',
    description: 'Buitres presenta su nuevo disco en el Antel Arena',
    startDate: new Date('2022-10-01'),
    endDate: new Date('2022-10-01'),
    country: 'Uruguay',
    city: 'Montevideo',
    enabled: false
});

const fiestaCarlCox = new Event({
    name: 'Fiesta Carl Cox',
    description: 'El gordo tira la casa por la ventana con una fiesta en Ovo',
    startDate: new Date('2022-10-05'),
    endDate: new Date('2022-10-06'),
    country: 'Uruguay',
    city: 'Punta del Este',
    enabled: false
});

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://mongo:27017/test').then( //se modifica la url de conexion para usar el nombre del contenedor por compose y que resuelva internamente por dns.
        () => console.log("Connected to mongo instance")
    );

    await conciertoBuitres.save();
    await fiestaCarlCox.save();

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}