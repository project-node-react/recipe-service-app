import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchAreas, fetchIngredients } from '../../redux/options/operations';
import { selectCategories, selectAreas, selectIngredients } from '../../redux/options/selectors';
import { addRecipe } from '../../redux/recipes/operations';
import styles from './AddRecipeForm.module.css';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  title: Yup.string().required('Required field'),
  description: Yup.string().max(200, 'Max 200 characters').required('Required field'),
  instructions: Yup.string().max(1000, 'Max 1000 characters').required('Required field'),
  ingredients: Yup.array().min(1, 'Add at least one ingredient').required('Required field'),
});

const AddRecipeForm = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const areas = useSelector(selectAreas);
  const ingredientsList = useSelector(selectIngredients);

  const [photoPreview, setPhotoPreview] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentMeasure, setCurrentMeasure] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAreas());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { photo: null, title: '', description: '', category: '', area: '', time: 10, instructions: '', ingredients: [] },
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

  const handleAddIngredient = () => {
    if (currentIngredient && currentMeasure) {
      const selectedIng = ingredientsList.find(i => i.id === currentIngredient);
      const newIngredient = {
        id: currentIngredient,
        name: selectedIng ? selectedIng.name : '',
        measure: currentMeasure,
      };
      formik.setFieldValue('ingredients', [...formik.values.ingredients, newIngredient]);
      setCurrentIngredient('');
      setCurrentMeasure('');
    }
  };

  const handleRemoveIngredient = (indexToRemove) => {
    const updatedIngredients = formik.values.ingredients.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue('ingredients', updatedIngredients);
  };

  return (
    <form className={styles.formContainer} onSubmit={formik.handleSubmit}>
      <div className={styles.photoSection}>
        <label className={styles.photoLabel}>
          <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
          {photoPreview ? <img src={photoPreview} alt="Preview" width="200" style={{ borderRadius: '8px' }} /> : <div className={styles.photoPlaceholder}><span>📷 Upload a photo</span></div>}
        </label>
      </div>

      <div className={styles.detailsSection}>
        <div>
          <input type="text" name="title" placeholder="Recipe title" className={styles.input} value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.title && formik.errors.title && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.title}</div>}
        </div>
        <div>
          <input type="text" name="description" placeholder="Description" className={styles.input} value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          {formik.touched.description && formik.errors.description && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.description}</div>}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Category</label>
            <select name="category" className={styles.select} value={formik.values.category} onChange={formik.handleChange} onBlur={formik.handleBlur}>
              <option value="" disabled>Select a category</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Cooking time</label>
            <div className={styles.timeCounter}>
              <button type="button" onClick={() => formik.setFieldValue('time', Math.max(1, formik.values.time - 5))}>-</button>
              <span> {formik.values.time} min </span>
              <button type="button" onClick={() => formik.setFieldValue('time', formik.values.time + 5)}>+</button>
            </div>
          </div>
        </div>
        <div className={styles.field}>
          <label>Area</label>
          <select name="area" className={styles.select} value={formik.values.area} onChange={formik.handleChange} onBlur={formik.handleBlur}>
            <option value="" disabled>Area</option>
            {areas.map((area) => (<option key={area.id} value={area.name}>{area.name}</option>))}
          </select>
        </div>

        <div className={styles.ingredientsBlock}>
          <h4>Ingredients</h4>
          <div className={styles.ingredientRow}>
            <select className={styles.select} value={currentIngredient} onChange={(e) => setCurrentIngredient(e.target.value)}>
              <option value="" disabled>Add the ingredient</option>
              {ingredientsList.map((ing) => (<option key={ing.id} value={ing.id}>{ing.name}</option>))}
            </select>
            <input type="text" placeholder="Quantity" className={styles.input} value={currentMeasure} onChange={(e) => setCurrentMeasure(e.target.value)} />
          </div>
          <button type="button" className={styles.addBtn} onClick={handleAddIngredient}>ADD INGREDIENT +</button>
          {formik.touched.ingredients && formik.errors.ingredients && <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.ingredients}</div>}
          
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
            {formik.values.ingredients.map((ing, index) => (
              <li key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
                <div><strong>{ing.name}</strong> - {ing.measure}</div>
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