
import { useState, useRef, useEffect } from 'react';
import { Box, Fab, Paper, TextField, Typography, IconButton, List, ListItem, Avatar } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { type OpenMeteoResponse } from '../types/Dashboardtypes';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

interface ChatbotUIProps {
    activeCity: string | null;
    weatherData?: OpenMeteoResponse;
}

export default function ChatbotUI({ activeCity, weatherData }: ChatbotUIProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "¡Hola! Soy WeatherBot AI 🤖. ¿Cómo te llamas?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userName, setUserName] = useState("");
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const toggleChat = () => setIsOpen(!isOpen);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen, isTyping]);

    const generateResponse = (input: string) => {
        const lowerInput = input.toLowerCase();

        // Memory logic
        if (!userName && (lowerInput.includes('me llamo') || lowerInput.includes('soy') || input.split(' ').length < 3)) {
            const nameAttempt = input.replace('me llamo', '').replace('soy', '').trim();
            if (nameAttempt) {
                setUserName(nameAttempt);
                return `¡Un gusto conocerte, ${nameAttempt}! ¿En qué ciudad te encuentras o qué deseas saber del clima?`;
            }
        }

        if (userName && (lowerInput.includes('hola') || lowerInput.includes('buenas'))) {
            return `¡Hola de nuevo, ${userName}!`;
        }

        // Check specific intents
        const mentionsTable = lowerInput.includes('tabla') || lowerInput.includes('datos') || lowerInput.includes('registros');
        const mentionsChart = lowerInput.includes('grafica') || lowerInput.includes('grafico') || lowerInput.includes('tendencia') || lowerInput.includes('visual');
        const mentionsSummary = lowerInput.includes('todo') || lowerInput.includes('resumen') || lowerInput.includes('completo');
        const mentionsWeather = lowerInput.includes('clima') || lowerInput.includes('temperatura') || lowerInput.includes('tiempo') || lowerInput.includes('pronostico');

        // 1. Priority: Comprehensive Report (Summary OR Multiple components mentioned OR Weather + Component)
        if (mentionsSummary || (mentionsTable && mentionsChart) || (mentionsWeather && (mentionsTable || mentionsChart))) {
            if (activeCity && weatherData && weatherData.current) {
                return `📝 **Reporte Completo para ${activeCity}:**

🌡️ **Clima Actual:**
• Temperatura: ${weatherData.current.temperature_2m}°C
• Sensación Térmica: ${weatherData.current.apparent_temperature}°C
• Humedad: ${weatherData.current.relative_humidity_2m}%
• Viento: ${weatherData.current.wind_speed_10m} km/h

📈 **Gráfico (24h):**
Visualiza la tendencia inmediata. Busca los picos más altos para saber la hora más calurosa del día.

📊 **Tabla (24h):**
Te ofrece un desglose detallado hora por hora para las próximas 24 horas. Útil para planificar actividades con antelación.`;
            } else {
                return "Para darte un resumen completo (clima, tabla y gráfica), primero selecciona una ciudad en el menú de arriba 👆.";
            }
        }

        // 2. Specific Table Question
        if (mentionsTable) {
            return "La tabla 📊 muestra el pronóstico hora por hora de las próximas 24 horas. En Value 1 verás la temperatura (°C) y en Value 2 la velocidad del viento (km/h).";
        }

        // 3. Specific Chart Question
        if (mentionsChart) {
            return "El gráfico 📈 visualiza la tendencia de las próximas 24 horas. Es útil para ver rápidamente los cambios inmediatos de temperatura y viento.";
        }

        // Variable check / Confirmation
        if (lowerInput.includes('ya') || lowerInput.includes('listo') || lowerInput.includes('seleccion')) {
            if (activeCity) {
                return `¡Perfecto! Veo que has seleccionado ${activeCity}. Pregúntame "¿cómo está el clima?" o sobre la tabla y el gráfico.`;
            } else {
                return "Aún no veo ninguna ciudad activa. Por favor selecciona una en el menú desplegable de arriba 👆.";
            }
        }

        // City logic
        const cities = ['guayaquil', 'quito', 'manta'];
        const mentionedCity = cities.find(city => lowerInput.includes(city));

        if (mentionedCity) {
            // Correct city selected
            if (activeCity && activeCity.toLowerCase() === mentionedCity) {
                if (weatherData && weatherData.current) {
                    return `En ${activeCity} la temperatura actual es de ${weatherData.current.temperature_2m}°C con una sensación térmica de ${weatherData.current.apparent_temperature}°C. La humedad es del ${weatherData.current.relative_humidity_2m}%.`;
                } else {
                    return `Estoy cargando los datos de ${activeCity}, dame un segundo...`;
                }
            }
            // Wrong city selected
            else {
                return `Para ver los datos de ${mentionedCity.charAt(0).toUpperCase() + mentionedCity.slice(1)}, por favor selecciónala en el menú desplegable superior ☝️.`;
            }
        }

        // General weather questions (uses current active city)
        if (lowerInput.includes('clima') || lowerInput.includes('temperatura') || lowerInput.includes('tiempo') || lowerInput.includes('pronostico')) {
            if (activeCity && weatherData && weatherData.current) {
                return `Ahora mismo en ${activeCity} tenemos ${weatherData.current.temperature_2m}°C. Parece un buen momento para revisar la gráfica de tendencias.`;
            } else if (!activeCity) {
                return "Primero selecciona una ciudad en el menú de arriba para poder informarte.";
            } else {
                return "Estoy obteniendo la información, un momento...";
            }
        }

        if (lowerInput.includes('gracias')) {
            return "¡De nada! Aquí estaré si necesitas más análisis meteorológico.";
        }

        return "🤔 No estoy seguro de entender eso. Puedo explicarte para qué sirve la tabla, el gráfico, o darte el reporte del clima si seleccionas una ciudad.";
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user'
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate thinking delay
        const typingTime = 1000 + Math.random() * 1000;

        setTimeout(() => {
            const botResponseText = generateResponse(newUserMessage.text);

            const newBotMessage: Message = {
                id: Date.now() + 1,
                text: botResponseText,
                sender: 'bot'
            };

            setMessages(prev => [...prev, newBotMessage]);
            setIsTyping(false);
        }, typingTime);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <>
            <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
                <Fab color="primary" aria-label="chat" onClick={toggleChat}>
                    {isOpen ? <CloseIcon /> : <RateReviewIcon />}
                </Fab>
            </Box>

            {isOpen && (
                <Paper
                    elevation={10}
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 20,
                        width: 340,
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        overflow: 'hidden',
                        borderRadius: 4
                    }}
                >
                    {/* Header */}
                    <Box sx={{ p: 2, bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>
                            <SmartToyIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">WeatherBot AI</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                {isTyping ? 'Escribiendo...' : 'En línea'}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={toggleChat} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', bgcolor: 'background.default' }}>
                        <List sx={{ p: 0 }}>
                            {messages.map((msg) => (
                                <ListItem key={msg.id} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', mb: 1, px: 0 }}>
                                    {msg.sender === 'bot' && (
                                        <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                                            <SmartToyIcon sx={{ fontSize: 16 }} />
                                        </Avatar>
                                    )}
                                    <Paper sx={{
                                        p: 1.5,
                                        maxWidth: '75%',
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        borderRadius: 2,
                                        borderTopLeftRadius: msg.sender === 'bot' ? 0 : 2,
                                        borderTopRightRadius: msg.sender === 'user' ? 0 : 2
                                    }}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                                    </Paper>
                                </ListItem>
                            ))}

                            {isTyping && (
                                <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1, px: 0 }}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>
                                        <SmartToyIcon sx={{ fontSize: 16 }} />
                                    </Avatar>
                                    <Paper sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 2, borderTopLeftRadius: 0 }}>
                                        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>Pensando...</Typography>
                                    </Paper>
                                </ListItem>
                            )}

                            <div ref={messagesEndRef} />
                        </List>
                    </Box>

                    {/* Input Area */}
                    <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Escribe algo..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            disabled={isTyping}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                        />
                        <IconButton color="primary" onClick={handleSend} disabled={!inputValue.trim() || isTyping}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
}
