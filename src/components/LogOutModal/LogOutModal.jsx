import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Modal from '../Modal/Modal';
import { logOut } from '../../redux/auth/operations';

import styles from './LogOutModal.module.css';

export default function LogOutModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
    } catch {
      // Незалежно від відповіді backend
      // користувача все одно деавторизуємо
    } finally {
      localStorage.clear();

      navigate('/');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.titleWrapper}>
          <h2 className={`${styles.title} ${styles.mobileTitle}`}>LOG OUT</h2>

          <h2 className={`${styles.title} ${styles.tabletTitle}`}>
            ARE YOU LOGGING OUT?
          </h2>

          <p className={styles.text}>You can always log back in at my time.</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            LOG OUT
          </button>

          <button
            type="button"
            className={styles.cancelButton}
            onClick={onClose}
          >
            CANCEL
          </button>
        </div>
      </div>
    </Modal>
  );
}
