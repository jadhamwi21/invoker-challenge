import styles from "./Pause.module.scss"
type Props = {}

const Pause = (props: Props) => {

    return (
        <p className={styles.text}>
            <p>The match is paused, wait your opponent to reconnect in [ X ]</p>

        </p>
    )
}

export default Pause