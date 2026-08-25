export const selectTestimonials = (state) => state.testimonials.items;

export const selectTestimonialsIsLoading = (state) =>
  state.testimonials.isLoading;

export const selectTestimonialsError = (state) => state.testimonials.error;
