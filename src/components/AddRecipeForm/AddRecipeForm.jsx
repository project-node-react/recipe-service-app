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
import Select from 'react-select';

const MAX_DESC_LENGTH = 200;
const MAX_INST_LENGTH = 1000;
const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}foodicon.svg`;

const handleIngredientImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = FALLBACK_IMAGE;
};

const validationSchema = Yup.object({
  title: Yup.string().required('Required field'),
  description: Yup.string().max(MAX_DESC_LENGTH, 'Max 200 chars').required('Required field'),
  instructions: Yup.string().max(MAX_INST_LENGTH, 'Max 1000 chars').required('Required field'),
  ingredients: Yup.array().min(1, 'Add at least one ingredient').required('Required field'),
  category: Yup.string().required('Required field'),
  area: Yup.string().required('Required field'),
  photo: Yup.mixed().required('Photo is required'),
});

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: '30px',
    padding: '6px 10px',
    borderColor: state.isFocused ? '#050505' : '#bfbebe',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#050505',
    }
  }),
  indicatorSeparator: () => ({ 
    display: 'none' // Прибирає вертикальну лінію біля стрілочки
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#1a1a1a',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '15px',
    overflow: 'hidden',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#f0f0f0' : '#fff',
    color: '#050505',
    cursor: 'pointer',
  })
};

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
        img: selectedIng?.img || null,
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

  const handleResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className={styles.container}>
      

      <form className={styles.formGrid} onSubmit={formik.handleSubmit}>
        
        {/* LEFT COLUMN: Photo */}
        <div className={styles.photoSection}>
          <label className={styles.photoLabel}>
            <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className={styles.photoPreview} />
            ) : (
              <div className={styles.photoPlaceholder}>
                <span className={styles.photoIcon} aria-hidden="true">
                  <svg className={styles.captureFrame}>
                    <use href={`${import.meta.env.BASE_URL}icons.svg#capture-frame`} />
                  </svg>
                  <svg className={styles.cameraIcon}>
                    <use href={`${import.meta.env.BASE_URL}icons.svg#camera`} />
                  </svg>
                </span>
                <span>Upload a photo</span>
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
            <textarea
              name="description"
              placeholder="Enter a description of the dish"
              className={`${styles.textarea} ${formik.touched.description && formik.errors.description ? styles.inputError : ''}`}
              value={formik.values.description}
              onChange={(e) => {
              formik.handleChange(e);
              handleResize(e);
            }}
            onBlur={formik.handleBlur}
            maxLength={MAX_DESC_LENGTH}
             rows={1}
            />
            <span className={`${styles.charCount} ${styles.descriptionCharCount}`}>
              <span
                className={
                  formik.values.description.length > 0
                    ? styles.currentCharCount
                    : undefined
                }
              >
                {formik.values.description.length}
              </span>
              <span>/{MAX_DESC_LENGTH}</span>
            </span>
            {formik.touched.description && formik.errors.description && <div className={styles.errorText}>{formik.errors.description}</div>}
          </div>

          <div className={styles.twoCols}>
            <div>
              <label className={styles.label}>CATEGORY</label>
              <Select
                styles={customStyles}
                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                onChange={(option) => formik.setFieldValue('category', option.value)}
                placeholder="Select a category"
                className={styles.reactSelectContainer}
                classNamePrefix="react-select"
            />
              {formik.touched.category && formik.errors.category && <div className={styles.errorText}>{formik.errors.category}</div>}
            </div>

            <div>
              <label className={styles.label}>COOKING TIME</label>
              <div className={styles.timeControl}>
                <button
                  type="button"
                  className={styles.timeBtn}
                  onClick={() => formik.setFieldValue('time', Math.max(1, formik.values.time - 1))}
                  aria-label="Decrease cooking time"
                >
                  <svg className={styles.minusIcon} aria-hidden="true">
                    <use href={`${import.meta.env.BASE_URL}icons.svg#minus`} />
                  </svg>
                </button>
                <span
                  className={
                    formik.values.time !== 10 ? styles.activeTime : undefined
                  }
                >
                  {formik.values.time} min
                </span>
                <button
                  type="button"
                  className={styles.timeBtn}
                  onClick={() => formik.setFieldValue('time', formik.values.time + 1)}
                  aria-label="Increase cooking time"
                >
                  <svg className={styles.plusIcon} aria-hidden="true">
                    <use href={`${import.meta.env.BASE_URL}icons.svg#plus`} />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className={styles.label}>AREA</label>
           <Select
            styles={customStyles}
            options={areas.map(area => ({ value: area.id, label: area.name }))}
            onChange={(option) => formik.setFieldValue('area', option.value)}
            placeholder="Select an area"
            className={styles.reactSelectContainer}
            classNamePrefix="react-select"
            />
            {formik.touched.area && formik.errors.area && <div className={styles.errorText}>{formik.errors.area}</div>}
          </div>

          <div>
            <label className={styles.label}>INGREDIENTS</label>
            <div className={styles.ingredientInputRow}>
              <Select
                styles={customStyles}
                options={ingredientsList.map(ing => ({ value: ing.id, label: ing.name }))}
                onChange={(option) => setCurrentIngredient(option.value)}
                placeholder="Add the ingredient"
                 className={styles.reactSelectContainer}
                classNamePrefix="react-select"
            />
              <input
                type="text"
                placeholder="Enter quantity"
                className={`${styles.input} ${styles.measureInput}`}
                value={currentMeasure}
                onChange={(e) => setCurrentMeasure(e.target.value)}
              />
            </div>
            <button type="button" className={styles.addIngredientBtn} onClick={handleAddIngredient}>
                Add ingredient
                <svg className={styles.addIcon} aria-hidden="true">
                  <use href={`${import.meta.env.BASE_URL}icons.svg#plus`} />
                </svg>
            </button>
            {formik.touched.ingredients && formik.errors.ingredients && <div className={styles.errorText}>{formik.errors.ingredients}</div>}

            {/* Ingredients List */}
            {formik.values.ingredients.length > 0 && (
              <div className={styles.ingredientsList}>
                {formik.values.ingredients.map((ing, index) => (
                  <div key={index} className={styles.ingredientCard}>
                    <div className={styles.ingredientImageWrap}>
                      <img
                        src={ing.img || FALLBACK_IMAGE}
                        alt={ing.img ? ing.name : ""}
                        className={styles.ingredientImg}
                        onError={handleIngredientImageError}
                      />
                    </div>
                    <div className={styles.ingredientInfo}>
                      <span className={styles.ingredientName}>{ing.name}</span>
                      <span className={styles.ingredientMeasure}>{ing.measure}</span>
                    </div>
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => handleRemoveIngredient(index)}
                      aria-label={`Remove ${ing.name}`}
                    >
                      <svg className={styles.removeIcon} aria-hidden="true">
                        <use href={`${import.meta.env.BASE_URL}icons.svg#close-small`} />
                      </svg>
                    </button>
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
              onChange={(e) => {
              formik.handleChange(e);
              handleResize(e);
              }}
              onBlur={formik.handleBlur}
              maxLength={MAX_INST_LENGTH}
            ></textarea>
            <span className={styles.charCount}>{formik.values.instructions.length}/{MAX_INST_LENGTH}</span>
            {formik.touched.instructions && formik.errors.instructions && <div className={styles.errorText}>{formik.errors.instructions}</div>}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClear}
              aria-label="Clear recipe form"
            >
              <svg aria-hidden="true">
                <use href={`${import.meta.env.BASE_URL}icons.svg#trash`} />
              </svg>
            </button>
            <button type="submit" className={styles.publishBtn}>PUBLISH</button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddRecipeForm;