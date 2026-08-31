import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Modal from "../Modal/Modal";
import { logOut } from "../../redux/auth/operations";
import { selectAuthIsLoading } from "../../redux/auth/selectors";
import { ClipLoader } from "react-spinners";
import style from "./LogOutModal.module.css";

export default function LogOutModal({ isOpen, onClose }) {
	const dispatch = useDispatch();
	const loading = useSelector(selectAuthIsLoading);

	const handleSubmit = async () => {
		try {
			await dispatch(logOut()).unwrap();
			onClose?.();
		} catch (error) {
			toast.error(error || "Server error. Please try again later");
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<div className={style.container}>
				<p className={style.title}>Are you logging out?</p>
				<p className={style.description}>
					You can always log back in at any time.
				</p>

				<div className={style.actions}>
					<button type="button" className={style.btn} onClick={handleSubmit}>
						{loading ? (
							<ClipLoader
								color="#ae0000"
								size={18}
								aria-label="Loading Spinner"
								data-testid="loader"
							/>
						) : (
							"Log Out"
						)}
					</button>
					<button type="button" className={style.btn_outline} onClick={onClose}>
						Cancel
					</button>
				</div>
			</div>
		</Modal>
	);
}
