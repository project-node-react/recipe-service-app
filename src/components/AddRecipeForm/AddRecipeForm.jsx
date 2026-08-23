import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { fetchCategories, fetchAreas, fetchIngredients } from '../../redux/options/operations';
import { selectCategories, selectAreas, selectIngredients } from '../../redux/options/selectors';
import { addRecipe } from '../../redux/recipes/operations';
import styles from './AddRecipeForm.module.css';

const MAX_DESC_LENGTH = 200;
const MAX_INST_LENGTH = 1000;

const validationSchema = Yup.object({
  title: Yup.string().required('Required field'),
  description: Yup.string().max(MAX_DESC_LENGTH, 'Max 200 chars').required('Required field'),
  instructions: Yup.string().max(MAX_INST_LENGTH, 'Max 1000 chars').required('Required field'),
  ingredients: Yup.array().min(1, 'Add at least one ingredient').required('Required field'),
  category: Yup.string().required('Required field'),
  area: Yup.string().required('Required field'),
  photo: Yup.mixed().required('Photo is required'),
});

const AddRecipeForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    initialValues: {
      photo: null,
      title: '',
      description: '',
      category: '',
      area: '',
      time: 10,
      instructions: '',
      ingredients: [],
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('instructions', values.instructions);
      formData.append('category', values.category);
      formData.append('area', values.area);
      formData.append('time', values.time.toString());
      
      const formattedIngredients = values.ingredients.map(ing => ({
        id: ing.id,
        measure: ing.measure,
      }));
      formData.append('ingredients', JSON.stringify(formattedIngredients));
      
      if (values.photo) {
        formData.append('thumb', values.photo);
      }

      dispatch(addRecipe(formData))
        .unwrap()
        .then(() => {
          toast.success("Recipe successfully added!");
          navigate("/"); 
        })
        .catch((err) => {
          toast.error(`Error: ${err}`);
        });
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
        // Assuming backend provides image URL for ingredients (e.g., selectedIng.img)
        img: selectedIng?.img || 'https://via.placeholder.com/40', 
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
    <div className={styles.container}>
      <h1 className={styles.title}>ADD RECIPE</h1>
      <p className={styles.subtitle}>Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.</p>

      <form className={styles.formGrid} onSubmit={formik.handleSubmit}>
        
        {/* LEFT COLUMN: Photo */}
        <div className={styles.photoSection}>
          <label className={styles.photoLabel}>
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <span>📷 Upload a photo</span>
              </div>
            )}
          </label>
          {photoPreview && (
            <button type="button" className={styles.uploadAnother} onClick={() => document.querySelector('input[type="file"]').click()}>
              Upload another photo
            </button>
          )}
          {formik.touched.photo && formik.errors.photo && <div className={styles.errorText}>{formik.errors.photo}</div>}
        </div>

        {/* RIGHT COLUMN: Details */}
        <div className={styles.detailsSection}>
          
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="title"
              placeholder="THE NAME OF THE RECIPE"
              className={`${styles.input} ${formik.touched.title && formik.errors.title ? styles.inputError : ''}`}
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && <div className={styles.errorText}>{formik.errors.title}</div>}
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              name="description"
              placeholder="Enter a description of the dish"
              className={`${styles.input} ${formik.touched.description && formik.errors.description ? styles.inputError : ''}`}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={MAX_DESC_LENGTH}
            />
            <span className={styles.charCount}>{formik.values.description.length}/{MAX_DESC_LENGTH}</span>
            {formik.touched.description && formik.errors.description && <div className={styles.errorText}>{formik.errors.description}</div>}
          </div>

          <div className={styles.twoCols}>
            <div>
              <label className={styles.label}>CATEGORY</label>
              <select
                name="category"
                className={styles.select}
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && <div className={styles.errorText}>{formik.errors.category}</div>}
            </div>

            <div>
              <label className={styles.label}>COOKING TIME</label>
              <div className={styles.timeControl}>
                <button type="button" className={styles.timeBtn} onClick={() => formik.setFieldValue('time', Math.max(1, formik.values.time - 5))}>-</button>
                <span> {formik.values.time} min </span>
                <button type="button" className={styles.timeBtn} onClick={() => formik.setFieldValue('time', formik.values.time + 5)}>+</button>
              </div>
            </div>
          </div>

          <div>
            <label className={styles.label}>AREA</label>
            <select
              name="area"
              className={styles.select}
              value={formik.values.area}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="" disabled>Select an area</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
            {formik.touched.area && formik.errors.area && <div className={styles.errorText}>{formik.errors.area}</div>}
          </div>

          <div>
            <label className={styles.label}>INGREDIENTS</label>
            <div className={styles.ingredientInputRow}>
              <select
                className={styles.select}
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
              >
                <option value="" disabled>Add the ingredient</option>
                {ingredientsList.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Enter quantity"
                className={styles.input}
                style={{ width: '40%' }}
                value={currentMeasure}
                onChange={(e) => setCurrentMeasure(e.target.value)}
              />
            </div>
            <button type="button" className={styles.addIngredientBtn} onClick={handleAddIngredient}>
              ADD INGREDIENT +
            </button>
            {formik.touched.ingredients && formik.errors.ingredients && <div className={styles.errorText}>{formik.errors.ingredients}</div>}

            {/* Ingredients List */}
            {formik.values.ingredients.length > 0 && (
              <div className={styles.ingredientsList}>
                {formik.values.ingredients.map((ing, index) => (
                  <div key={index} className={styles.ingredientCard}>
                    <img src={ing.img} alt={ing.name} className={styles.ingredientImg} />
                    <div className={styles.ingredientInfo}>
                      <span className={styles.ingredientName}>{ing.name}</span>
                      <span>{ing.measure}</span>
                    </div>
                    <button type="button" className={styles.removeBtn} onClick={() => handleRemoveIngredient(index)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>RECIPE PREPARATION</label>
            <textarea
              name="instructions"
              placeholder="Enter recipe"
              className={`${styles.textarea} ${formik.touched.instructions && formik.errors.instructions ? styles.inputError : ''}`}
              value={formik.values.instructions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              maxLength={MAX_INST_LENGTH}
            ></textarea>
            <span className={styles.charCount}>{formik.values.instructions.length}/{MAX_INST_LENGTH}</span>
            {formik.touched.instructions && formik.errors.instructions && <div className={styles.errorText}>{formik.errors.instructions}</div>}
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.clearBtn} onClick={handleClear}>🗑</button>
            <button type="submit" className={styles.publishBtn}>PUBLISH</button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddRecipeForm;