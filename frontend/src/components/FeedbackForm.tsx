import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { MessageSquare, Send, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

interface FeedbackFormData {
  name: string
  email: string
  content: string
  rating: number
}

const FeedbackForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRating, setSelectedRating] = useState(5)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      name: '',
      email: '',
      content: '',
      rating: 5,
    },
  })

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating)
    setValue('rating', rating, { shouldValidate: true })
  }

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true)

    try {
      await api.post('/testimonials/submit', data)
      toast.success('Thanks for your feedback. It will appear once approved.')
      reset({ name: '', email: '', content: '', rating: 5 })
      setSelectedRating(5)
    } catch (error: any) {
      console.error('Error submitting feedback:', error)

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorMessages = error.response.data.errors.map((entry: any) => entry.msg).join(', ')
        toast.error(`Validation Error: ${errorMessages}`)
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit feedback. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
              <MessageSquare className="h-7 w-7" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Share Your <span className="text-gradient">Feedback</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Worked with Eroots? Leave a quick review. Every submission is screened before it goes live.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Name *</label>
                  <input
                    {...register('name', {
                      required: 'Name is required',
                      maxLength: {
                        value: 100,
                        message: 'Name must not exceed 100 characters',
                      },
                    })}
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">Email *</label>
                  <input
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-gray-900">Rating *</label>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const ratingValue = index + 1

                    return (
                      <button
                        key={`feedback-rating-${ratingValue}`}
                        type="button"
                        onClick={() => handleRatingSelect(ratingValue)}
                        className="rounded-full p-1 transition-transform hover:scale-110"
                        aria-label={`Rate ${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            ratingValue <= selectedRating ? 'fill-current text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    )
                  })}
                  <span className="ml-2 text-sm font-medium text-gray-600">{selectedRating}/5</span>
                </div>
                <input
                  {...register('rating', {
                    required: 'Rating is required',
                    min: 1,
                    max: 5,
                  })}
                  type="hidden"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">Message *</label>
                <textarea
                  {...register('content', {
                    required: 'Feedback message is required',
                    minLength: {
                      value: 20,
                      message: 'Message must be at least 20 characters long',
                    },
                    maxLength: {
                      value: 500,
                      message: 'Message must not exceed 500 characters',
                    },
                  })}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell people what your experience with Eroots was like."
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
              </div>

              <div className="rounded-2xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm text-primary-800">
                Reviews stay hidden until an admin approves them, so spam and incomplete submissions never show up publicly.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary inline-flex w-full items-center justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeedbackForm
