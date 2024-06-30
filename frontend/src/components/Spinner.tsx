import styles from "../styles/css/Spinner.module.css";
import styleUtils from "../styles/css/utils.module.css";

const Spinner = () => {
    return (
        <div className={`${styles.ldsRing} ${styleUtils.center}`}><div></div><div></div><div></div><div></div></div>
     );
}

export const SpinnerSmall = () => {
    return (
        <div className={`${styles.ldsRingSmall} ${styleUtils.center}`}><div></div><div></div><div></div><div></div></div>
     );
}
 
export default Spinner;