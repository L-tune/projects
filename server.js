const express = require('express');
const app = express();
const path = require('path');
const Airtable = require('airtable');
const airtable = require('./airtable');

// Настройка Airtable
const base = new Airtable({apiKey: 'patbrJG7AijGrgh5B.c409de248e874e7c3a0221945f51941e2aa4a07b476af38834c62c5ca4994ef5'}).base('appVTAs48STHKWGSF');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Маршрут для корневой страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обновите API endpoints
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await airtable.getCars();
    res.json(cars);
  } catch (error) {
    console.error('Ошибка при получении списка автомобилей:', error);
    res.status(500).json({ error: 'Не удалось получить список автомобилей' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const id = await airtable.addCar(req.body);
    res.json({ id });
  } catch (error) {
    console.error('Ошибка при добавлении автомобиля:', error);
    res.status(500).json({ error: 'Не удалось добавить автомобиль' });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    await airtable.updateCar(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении автомобиля:', error);
    res.status(500).json({ error: 'Не удалось обновить автомобиль' });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    await airtable.deleteCar(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при удалении автомобиля:', error);
    res.status(500).json({ error: 'Не удалось удалить автомобиль' });
  }
});

// Запуск сервера
const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => console.log('Сервер запущен на порту ' + PORT));
