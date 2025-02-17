// app/components/SignupModal.tsx
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../front-styles/SignupModal.module.css';

const SignupModal = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'none' });
  const router = useRouter();

  // Fonction de gestion du changement des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fonction de soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirection vers la page spécifique en fonction du rôle
    if (formData.role === 'super-admin') {
      router.push('/super-admin');
    } else if (formData.role === 'manager') {
      router.push('/manager');
    } else {
      router.push('/');
    }

    // Fermer le modal après soumission
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.close} onClick={onClose}>X</button>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="none">None</option>
              <option value="manager">Manager</option>
              <option value="super-admin">Super Admin</option>
            </select>
          </div>
          <div className={styles.formFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Submit</button>
          </div>
        </form>
        <div className={styles.loginLink}>
          <p>Vous êtes déjà inscrit ? <a href="/auth/login">Se connecter</a></p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
