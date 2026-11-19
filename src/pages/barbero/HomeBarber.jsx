import slide1 from "../../assets/slide1.png";
import slide2 from "../../assets/slide2.png";
import slide3 from "../../assets/slide3.png";
import ListaTurnosAsignados from "../cliente/ListaTurnosAsignados";
import styles from "./HomeBarber.module.css";
export default function HomeBarber() {
  return (
    <div>
      <div className={styles.seccionOscura}>
        {/* 1. CAROUSEL HERO */}
        <div className="position-relative overflow-hidden">
          <div
            className={`position-absolute top-50 start-0 translate-middle-y w-100 text-center z-3 ${styles.point}`}
          >
            <div className="bg-dark bg-opacity-75 py-1 px-2 w-100 mb-2">
              <h1 className={`text-white fw-bold ${styles.georgia}`}>
                Home <span className={styles.dorado}>Barberos</span>
              </h1>
            </div>
            <p className={`text-white ${styles.subtitulo}`}></p>
          </div>

          <div
            id="carouselExampleSlidesOnly"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={slide1}
                  className={`d-block w-100 object-fit-cover ${styles.carouselImg}`}
                  alt="slide1"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={slide2}
                  className={`d-block w-100 object-fit-cover ${styles.carouselImg}`}
                  alt="slide2"
                />
              </div>
              <div className="carousel-item">
                <img
                  src={slide3}
                  className={`d-block w-100 object-fit-cover ${styles.carouselImg}`}
                  alt="slide3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className={styles.boton}>
        Reservar un Turno
      </button>
      <ListaTurnosAsignados />
    </div>
  );
}
