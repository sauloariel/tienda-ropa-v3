import server from "./server";

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`El servidor esta corriendo en el puerto http://localhost:${PORT}`);
});
