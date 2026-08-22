import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './AddRecipeForm.module.css';

const validationSchema = Yup.object({
  title: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Max 200 characters').required('Required field'),
  instructions: Yup.string().max(1000, 'Max 1000 characters').required('Required field'),
  ingredients: Yup.array().min(1, 'Add at least one ingredient').required('Required field'),
});

const AddRecipeForm = () => {
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // Тимчасові стани для полів вводу інгредієнта
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentMeasure, setCurrentMeasure] = useState('');

  const formik = useFormik({
    initialValues: {
      photo: null,
      title: '',
      description: '',
      time: 10,
      instructions: '',
      ingredients: [], // Масив для збережених інгредієнтів
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Form data ready to send:', values);
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('photo', file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleClear = () => {
    formik.resetForm();
    setPhotoPreview(null);
    setCurrentIngredient('');
    setCurrentMeasure('');
  };

  // Додавання інгредієнта в масив Formik
  const handleAddIngredient = () => {
    if (currentIngredient && currentMeasure) {
      const newIngredient = {
        name: currentIngredient, // Поки використовуємо ім'я. Потім тут буде ID з бекенду
        measure: currentMeasure,
      };
      formik.setFieldValue('ingredients', [...formik.values.ingredients, newIngredient]);
      setCurrentIngredient(''); // Очищаємо поля
      setCurrentMeasure('');
    }
  };

  // Видалення інгредієнта зі списку
  const handleRemoveIngredient = (indexToRemove) => {
    const updatedIngredients = formik.values.ingredients.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue('ingredients', updatedIngredients);
  };

  return (
    <form className={styles.formContainer} onSubmit={formik.handleSubmit}>
      {/* ... ФОТО СЕКЦІЯ ЗАЛИШАЄТЬСЯ БЕЗ ЗМІН ... */}
      <div className={styles.photoSection}>
        <label className={styles.photoLabel}>
          <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          {photoPreview ? (
            <img src={photoPreview} alt="Recipe preview" width="200" style={{ borderRadius: '8px' }} />
          ) : (
            <div className={styles.photoPlaceholder}><span>📷 Upload a photo</span></div>
          )}
        </label>
      </div>

      <div className={styles.detailsSection}>
        {/* ... TITLE ТА DESCRIPTION ЗАЛИШАЮТЬСЯ БЕЗ ЗМІН ... */}
        <div>
          <input type="text" name="title" placeholder="The name of the recipe" className={styles.input} value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.title && formik.errors.title && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.title}</div>}
        </div>
        <div>
          <input type="text" name="description" placeholder="Enter a description" className={styles.input} value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.description && formik.errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.description}</div>}
        </div>

        {/* ... CATEGORY, TIME ТА AREA ЗАЛИШАЮТЬСЯ БЕЗ ЗМІН ... */}
        <div className={styles.row}>
          <div className={styles.field}><label>Category</label><select className={styles.select}><option>Select a category</option></select></div>
          <div className={styles.field}><label>Cooking time</label><div className={styles.timeCounter}><button type="button" onClick={() => formik.setFieldValue('time', Math.max(1, formik.values.time - 5))}>-</button><span> {formik.values.time} min </span><button type="button" onClick={() => formik.setFieldValue('time', formik.values.time + 5)}>+</button></div></div>
        </div>
        <div className={styles.field}><label>Area</label><select className={styles.select}><option>Area</option></select></div>

        {/* --- НОВИЙ БЛОК ІНГРЕДІЄНТІВ --- */}
        <div className={styles.ingredientsBlock}>
          <h4>Ingredients</h4>
          <div className={styles.ingredientRow}>
            {/* Поки що це звичайний input замість select, щоб ти могла протестувати логіку. Пізніше замінимо на селект з бекенду */}
            <input type="text" placeholder="Ingredient name (e.g. Salmon)" className={styles.input} value={currentIngredient} onChange={(e) => setCurrentIngredient(e.target.value)} />
            <input type="text" placeholder="Enter quantity (e.g. 400g)" className={styles.input} value={currentMeasure} onChange={(e) => setCurrentMeasure(e.target.value)} />
          </div>
          <button type="button" className={styles.addBtn} onClick={handleAddIngredient}>ADD INGREDIENT +</button>
          
          {/* Помилка якщо немає інгредієнтів */}
          {formik.touched.ingredients && formik.errors.ingredients && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.ingredients}</div>}

          {/* Список доданих інгредієнтів */}
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
            {formik.values.ingredients.map((ing, index) => (
              <li key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <div>
                  <strong>{ing.name}</strong> - {ing.measure}
                </div>
                <button type="button" onClick={() => handleRemoveIngredient(index)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer' }}>❌</button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.preparationBlock}>
          <h4>Recipe Preparation</h4>
          <textarea name="instructions" placeholder="Enter recipe" className={styles.textarea} value={formik.values.instructions} onChange={formik.handleChange} onBlur={formik.handleBlur} ></textarea>
           {formik.touched.instructions && formik.errors.instructions && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.instructions}</div>}
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.clearBtn} onClick={handleClear}>🗑</button>
          <button type="submit" className={styles.publishBtn}>PUBLISH</button>
        </div>
      </div>
    </form>
  );
};

export default AddRecipeForm;