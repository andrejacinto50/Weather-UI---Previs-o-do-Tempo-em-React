import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  const apiKey = "e2efbd18f09ad38b463b2900215cfd6d";

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    // Detectar tema do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const getWeather = async () => {
    try {
      setError('');
      setWeather(null);
      setForecast([]);
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      setWeather(res.data);

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
      );
      const daily = forecastRes.data.list.filter((_, idx) => idx % 8 === 0); // previsao de 3 em 3 dias
      setForecast(daily);

    } catch (err) {
      setError('Cidade não encontrada.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 text-white text-2xl">
        Carregando previsão...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 dark:from-gray-900 dark:to-black text-white p-4">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Previsão do Tempo
      </motion.h1>

      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Digite o nome da cidade"
          className="w-full p-2 rounded mb-4 text-black"
        />
        <button
          onClick={getWeather}
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition w-full"
        >
          Buscar
        </button>

        {error && <p className="text-red-300 mt-4">{error}</p>}

        <AnimatePresence>
          {weather && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-semibold">{weather.name}, {weather.sys.country}</h2>
              <p className="text-xl mt-2">{Math.round(weather.main.temp)}°C</p>
              <p className="capitalize mt-1">{weather.weather[0].description}</p>
              <img
                className="mx-auto mt-4"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Clima"
              />

              {forecast.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Próximos dias</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {forecast.map((day, idx) => (
                      <div key={idx} className="bg-white/20 p-3 rounded-lg">
                        <p className="text-sm">{new Date(day.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                        <img
                          className="mx-auto"
                          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                          alt=""
                        />
                        <p className="text-sm">{Math.round(day.main.temp)}°C</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
