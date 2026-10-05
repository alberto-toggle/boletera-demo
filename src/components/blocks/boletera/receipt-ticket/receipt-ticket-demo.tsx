import { ReceiptTicket, type ReceiptTicketData } from "./receipt-ticket";
import styles from "@/features/booking/components/receipt-ticket.module.css";

const sampleTicket: ReceiptTicketData = {
  id: "DEMO-BOL-0028",
  event: "Noche de Independencia",
  occasion: "CENA · BAILE · CELEBRACIÓN",
  date: "15 SEP 2027",
  time: "19:00 H · CDMX",
  venue: "Salón Independencia",
  address: "Ciudad de México · Recinto de demostración",
  section: "PREFERENTE",
  table: "08",
  seat: "04",
  holder: "Andrea Martínez",
  amountMinor: 150000,
  currency: "MXN",
};

export default function ReceiptTicketDemo() {
  return (
    <div className={styles.stage}>
      <header className={styles.intro}>
        <p>··· COLECCIÓN BOLETERA ···</p>
        <h2>UN RECUERDO DE LA NOCHE</h2>
        <span>PAPEL, TINTA Y UNA EXPERIENCIA POR VIVIR.</span>
      </header>
      <div className={styles.examples}>
        <section
          className={styles.verticalExample}
          aria-label="Boleto vertical"
        >
          <p className={styles.caption}>01 / VERTICAL</p>
          <ReceiptTicket ticket={sampleTicket} />
        </section>
        <section
          className={styles.horizontalExample}
          aria-label="Boleto horizontal"
        >
          <p className={styles.caption}>02 / HORIZONTAL</p>
          <ReceiptTicket
            ticket={{ ...sampleTicket, id: "DEMO-BOL-0029", seat: "05" }}
            orientation="horizontal"
          />
        </section>
      </div>
    </div>
  );
}
