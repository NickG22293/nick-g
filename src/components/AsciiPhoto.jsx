import familyImg from '../assets/family.png'
import styles from './AsciiPhoto.module.css'

export default function AsciiPhoto() {
  return (
    <img
      src={familyImg}
      alt="Nick and family"
      className={styles.photo}
    />
  )
}
