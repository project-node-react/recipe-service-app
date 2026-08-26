import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { fetchTestimonials } from '../../redux/testimonials/operations';

import {
  selectTestimonials,
  selectTestimonialsIsLoading,
} from '../../redux/testimonials/selectors';

import css from './Testimonials.module.css';

const Testimonials = () => {
  const dispatch = useDispatch();

  const testimonials = useSelector(selectTestimonials) || [];
  const isLoading = useSelector(selectTestimonialsIsLoading);

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide >= testimonials.length - 1 ? 0 : prevSlide + 1,
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [testimonials.length]);

  if (isLoading || testimonials.length === 0) {
    return null;
  }

  const safeSlide = currentSlide >= testimonials.length ? 0 : currentSlide;

  const currentTestimonial = testimonials[safeSlide];

  if (!currentTestimonial) {
    return null;
  }

  const { testimonial, owner } = currentTestimonial;

  return (
    <section className={css.section}>
      <div className={css.container}>
        <svg className={css.icon} aria-hidden="true">
          <use href="/icons.svg#icon-quote" />
        </svg>
        <p className={css.subtitle}>What our customer say</p>

        <h2 className={css.title}>Testimonials</h2>

        <div className={css.slider}>
          <div className={css.slide}>
            <p className={css.text}>{testimonial}</p>

            <p className={css.author}>{owner?.name}</p>
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className={css.pagination}>
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`${css.paginationButton} ${
                  safeSlide === index ? css.active : ''
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
