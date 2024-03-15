import { selectPlayer } from '@/redux/slices/player.slice'
import { useAppSelector } from '@/redux/store'
import styles from "./Greeting.module.scss"
type Props = {}

const Greeting = (props: Props) => {
    const { details } = useAppSelector(selectPlayer)
    return (
        <p className={styles.text}>
            <p>The match will begin...</p>
            <p>
                GL & HF{" "}
                <span className={styles.name}>
                    [ {details.firstname.toUpperCase()} ]
                </span>
            </p>
        </p>
    )
}

export default Greeting