import familyImg from '../assets/family.png'
import familyChaoticImg from '../assets/family-chaotic.png'
import styles from './AsciiPhoto.module.css'

export default function AsciiPhoto() {
  return (
    <div className={styles.wrapper}>
      <img src={familyImg} alt="Nick and family" className={styles.photo} />
      <img src={familyChaoticImg} alt="" aria-hidden className={styles.chaotic} />
    </div>
  )
}
