import server from './server';  // <-- default OK

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
