import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.png';
import styles from './Home.module.css';
import { LuBox, LuSparkles, LuDroplet, LuFlaskConical } from 'react-icons/lu';

export default function Home() {
    return (
        <div className={styles.seccionOscura}>
            {/* 1. CAROUSEL HERO */}
            <div className="position-relative overflow-hidden">
                <div className={`position-absolute top-50 start-0 translate-middle-y w-100 text-center z-3 ${styles.point}`}>
                    <div className="bg-dark bg-opacity-75 py-1 px-2 w-100 mb-2">
                        <h1 className={`text-white fw-bold ${styles.georgia}`}>
                            Bienvenidos a <span className={styles.dorado}>Barberia Clase A</span>
                        </h1>
                    </div>
                    <p className={`text-white ${styles.subtitulo}`}>
                        Exclusivo para caballeros
                    </p>
                </div>

                <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src={slide1} className={`d-block w-100 object-fit-cover ${styles.carouselImg}`} alt="slide1" />
                        </div>
                        <div className="carousel-item">
                            <img src={slide2} className={`d-block w-100 object-fit-cover ${styles.carouselImg}`} alt="slide2" />
                        </div>
                        <div className="carousel-item">
                            <img src={slide3} className={`d-block w-100 object-fit-cover ${styles.carouselImg}`} alt="slide3" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. BIENVENIDA / ESTILO PREMIUM */}
            <section className="py-5 px-3 text-center">
                <div className="container">
                    <h2 className={`fw-bold text-uppercase text-white mb-2 ${styles.georgia}`}>
                        ELEGÍ <span className={styles.dorado}>TU ESTILO PREMIUM</span>
                    </h2>
                    <p className={`text-white ${styles.subtitulo}`}>
                        Donde la tradición se encuentra con la modernidad. Elevando el estándar del cuidado masculino.
                    </p>
                </div>
            </section>

            {/* 3. SECCIÓN PRODUCTOS */}
            <section className="py-5 px-3">
                <div className="container">
                    <p className={`text-uppercase mb-2 ${styles.etiquetaDorada}`}>PRODUCTOS</p>
                    <h2 className={`fw-bold mb-3 ${styles.tituloSeccion} ${styles.georgia}`}>
                        Para que el corte <br /> dure en casa
                    </h2>
                    <p className={`mb-5 ${styles.textoDescripcion}`}>
                        Los mismos productos que usamos en la barbería. Pedile a tu barbero que te muestre cuál va con tu pelo.
                    </p>

                    <div className="row g-4">
                        {/* Producto 1 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className={`card h-100 p-2 ${styles.cardProducto}`}>
                                <div className="card-body">
                                    <LuBox size={32} className={`mb-3 ${styles.dorado}`} />
                                    <h5 className={`card-title fw-bold text-white ${styles.georgia}`}>Cera mate</h5>
                                    <p className={`card-text ${styles.textoDescripcion}`}>
                                        Fijación fuerte y acabado seco para peinados con textura.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Producto 2 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className={`card h-100 p-2 ${styles.cardProducto}`}>
                                <div className="card-body">
                                    <LuSparkles size={32} className={`mb-3 ${styles.dorado}`} />
                                    <h5 className={`card-title fw-bold text-white ${styles.georgia}`}>Pomada brillo</h5>
                                    <p className={`card-text ${styles.textoDescripcion}`}>
                                        Base agua, fijación media y brillo para el peinado clásico.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Producto 3 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className={`card h-100 p-2 ${styles.cardProducto}`}>
                                <div className="card-body">
                                    <LuDroplet size={32} className={`mb-3 ${styles.dorado}`} />
                                    <h5 className={`card-title fw-bold text-white ${styles.georgia}`}>Aceite para barba</h5>
                                    <p className={`card-text ${styles.textoDescripcion}`}>
                                        Suaviza, hidrata y controla el frizz. Aroma a madera y cuero.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Producto 4 */}
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className={`card h-100 p-2 ${styles.cardProducto}`}>
                                <div className="card-body">
                                    <LuFlaskConical size={32} className={`mb-3 ${styles.dorado}`} />
                                    <h5 className={`card-title fw-bold text-white ${styles.georgia}`}>Shampoo para barba</h5>
                                    <p className={`card-text ${styles.textoDescripcion}`}>
                                        Limpia sin resecar la piel ni quitar el aceite natural.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className={`mt-4 mb-0 ${styles.textoDescripcion}`}>
                        Consultá el stock en la barbería o por WhatsApp.
                    </p>
                </div>
            </section>

            {/* 4. SECCIÓN EL RITUAL CLASE A */}
            <section className="py-5 px-3">
                <div className="container">
                    <p className={`text-uppercase mb-2 ${styles.etiquetaDorada}`}>EL RITUAL CLASE A</p>
                    <h2 className={`fw-bold mb-5 ${styles.tituloSeccion} ${styles.georgia}`}>
                        Así es tu turno, de <br /> la silla a la puerta
                    </h2>

                    {/* Línea horizontal dorada */}
                    <div className={`mb-4 ${styles.lineaDorada}`}></div>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4">
                        <div className="col">
                            <span className={`d-block mb-3 fw-bold ${styles.numeroRitual} ${styles.georgia}`}>1</span>
                            <h3 className={`h5 fw-bold text-white mb-2 ${styles.georgia}`}>Charla</h3>
                            <p className={`small ${styles.textoDescripcion}`}>
                                Hablamos de qué querés y qué te conviene.
                            </p>
                        </div>

                        <div className="col">
                            <span className={`d-block mb-3 fw-bold ${styles.numeroRitual} ${styles.georgia}`}>2</span>
                            <h3 className={`h5 fw-bold text-white mb-2 ${styles.georgia}`}>Lavado</h3>
                            <p className={`small ${styles.textoDescripcion}`}>
                                Cabeza lavada y masajeada antes de tocar tijera.
                            </p>
                        </div>

                        <div className="col">
                            <span className={`d-block mb-3 fw-bold ${styles.numeroRitual} ${styles.georgia}`}>3</span>
                            <h3 className={`h5 fw-bold text-white mb-2 ${styles.georgia}`}>Corte</h3>
                            <p className={`small ${styles.textoDescripcion}`}>
                                Tijera y máquina, con el detalle que pediste.
                            </p>
                        </div>

                        <div className="col">
                            <span className={`d-block mb-3 fw-bold ${styles.numeroRitual} ${styles.georgia}`}>4</span>
                            <h3 className={`h5 fw-bold text-white mb-2 ${styles.georgia}`}>Toalla caliente</h3>
                            <p className={`small ${styles.textoDescripcion}`}>
                                Vapor y navaja para barba y contorno.
                            </p>
                        </div>

                        <div className="col">
                            <span className={`d-block mb-3 fw-bold ${styles.numeroRitual} ${styles.georgia}`}>5</span>
                            <h3 className={`h5 fw-bold text-white mb-2 ${styles.georgia}`}>Terminación</h3>
                            <p className={`small ${styles.textoDescripcion}`}>
                                Peinado con producto y espejo para que lo apruebes.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}