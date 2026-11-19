import CardTurnos from '../components/cardTurnos/CardTurnos';

export default function ListaTurnosAsignados() {
   {/* const [barberos, setBarberos] = useState([]);
    const [cargando, setCargando] = useState(true);

    // 3. Ejecutamos la petición HTTP al cargar el componente
    useEffect(() => {
        fetch("http://localhost:8000/api/empleados/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return response.json();
            })
            .then((data) => {
                
                const listaBarberos = Array.isArray(data) ? data : (data.results || []);
                setBarberos(listaBarberos); 
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al conectar con la API:", error);
                setCargando(false);
            });
    }, []);
    */}
    const LISTA_DE_TURNOS=[
    {id: 1,hora: "10:30",nombre: "Felipe Yatra",servicios: "Corte Mullet, Barba, Perfilado de Cejas, Lavado de cabeza"},
    {id: 2,hora: "11:15",nombre: "Mateo González",servicios: "Corte Fade (Degradado), Diseño de líneas, Lavado"},
    {id: 3,hora: "12:00",nombre: "Lucas Fernández",servicios: "Corte Clásico a tijera, Arreglo de barba con toalla caliente"},
    {id: 4,hora: "13:00",nombre: "Thiago Sosa",servicios: "Buzz Cut, Perfilado de Cejas, Hidratación capilar"},
    {id: 5,hora: "15:30",nombre: "Benjamín Romero",servicios: "Corte Texturizado, Barba completa, Lavado de cabeza"},
    {id: 6,hora: "16:15",nombre: "Santiago Díaz",servicios: "Low Fade, Afeitado tradicional, Perfilado de Cejas"},
    {id: 7,hora: "17:00",nombre: "Valentín Torres",servicios: "Corte Taper, Recorte de bigote, Lavado y peinado"},
    {id: 8,hora: "17:45",nombre: "Joaquín Ruiz",servicios: "Corte Pompadour, Barba express, Perfilado de Cejas"},
    {id: 9,hora: "18:30",nombre: "Nicolás Morales",servicios: "Mid Fade, Rituales de barba, Masaje capilar"},
    {id: 10,hora: "19:15",nombre: "Tomás Álvarez",servicios: "Corte French Crop, Barba, Perfilado de Cejas, Lavado"}
    ];

    return (
        <section>
            <div className="d-flex flex-wrap gap-3">
                {LISTA_DE_TURNOS.length === 0 ? (
                    <p>Turnos Registrados</p>
                ) : (
                    LISTA_DE_TURNOS.map((cliente) => (
                        <CardTurnos
                            key={cliente.id}
                            hora={cliente.hora}
                            nombre={cliente.nombre}
                            servicios={cliente.servicios}
                        />
                    ))
                )}
            </div>
        </section>
  )
}
